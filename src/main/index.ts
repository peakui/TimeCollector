// 导入 Electron 核心模块
import {
  app, // 应用程序控制
  shell, // 外部链接处理
  BrowserWindow, // 窗口管理
  ipcMain, // 主进程 IPC 通信
  clipboard, // 剪贴板操作
  globalShortcut, // 全局快捷键
  nativeImage // 图片处理
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// 主窗口实例
let mainWindow: BrowserWindow | null = null

// 剪贴板历史项类型定义
type ClipboardItem =
  | { id: string; kind: 'text'; text: string; createdAt: number } // 文本类型
  | { id: string; kind: 'image'; imageDataUrl: string; createdAt: number } // 图片类型

// 配置常量
const MAX_HISTORY = 200 // 最大历史记录数量
const POLL_INTERVAL_MS = 500 // 剪贴板轮询间隔（毫秒）

// 剪贴板状态跟踪
let lastClipboardText = '' // 上次复制的文本
let lastClipboardImageDataUrl = '' // 上次复制的图片数据URL
let pollTimer: NodeJS.Timeout | null = null // 轮询定时器
const historyItems: ClipboardItem[] = [] // 历史记录数组

/**
 * 添加剪贴板历史项
 * @param item 要添加的剪贴板项
 */
function addHistoryItem(item: ClipboardItem): void {
  // 去重：避免相邻重复项，保留最新的
  if (historyItems.length > 0) {
    const top = historyItems[0]
    if (
      (item.kind === 'text' && top.kind === 'text' && top.text === item.text) ||
      (item.kind === 'image' && top.kind === 'image' && top.imageDataUrl === item.imageDataUrl)
    ) {
      return
    }
  }

  // 查找并移除已存在的相同内容项
  const existingIndex = historyItems.findIndex((h) =>
    h.kind === 'text' && item.kind === 'text'
      ? h.text === item.text
      : h.kind === 'image' && item.kind === 'image'
        ? h.imageDataUrl === item.imageDataUrl
        : false
  )
  if (existingIndex !== -1) historyItems.splice(existingIndex, 1)

  // 将新项添加到数组开头
  historyItems.unshift(item)

  // 限制历史记录数量
  if (historyItems.length > MAX_HISTORY) historyItems.length = MAX_HISTORY

  // 通知渲染进程更新历史记录
  mainWindow?.webContents.send('history:updated')
}

/**
 * 开始剪贴板轮询监听
 */
function startClipboardPolling(): void {
  if (pollTimer) return // 避免重复启动

  pollTimer = setInterval(() => {
    try {
      // 检查文本剪贴板
      const currentText = clipboard.readText()
      if (currentText && currentText !== lastClipboardText) {
        lastClipboardText = currentText
        const normalized = currentText.trim()
        if (normalized) {
          addHistoryItem({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            kind: 'text',
            text: normalized,
            createdAt: Date.now()
          })
        }
      }

      // 检查图片剪贴板
      const img = clipboard.readImage()
      if (!img.isEmpty()) {
        // 使用 PNG data URL 进行稳定比较和渲染
        const dataUrl = img.toDataURL()
        if (dataUrl && dataUrl !== lastClipboardImageDataUrl) {
          lastClipboardImageDataUrl = dataUrl
          addHistoryItem({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            kind: 'image',
            imageDataUrl: dataUrl,
            createdAt: Date.now()
          })
        }
      }
    } catch {
      // 忽略剪贴板访问的临时错误
    }
  }, POLL_INTERVAL_MS)
}

/**
 * 停止剪贴板轮询监听
 */
function stopClipboardPolling(): void {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

/**
 * 切换窗口显示/隐藏状态
 */
function toggleWindowVisibility(): void {
  if (!mainWindow) return
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

/**
 * 创建主窗口
 */
function createWindow(): void {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // 初始不显示
    autoHideMenuBar: true, // 自动隐藏菜单栏
    icon: join(__dirname, '../../resources/icon.ico'), // 设置窗口图标
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, '../preload/index.js'), // 预加载脚本
      sandbox: false // 禁用沙箱模式以支持 Node.js API
    },
    frame: false
  })

  // 窗口准备显示时显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 开发环境热重载支持
  // 开发时加载远程 URL，生产时加载本地 HTML 文件
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Windows 平台关闭行为：隐藏而不是退出
  mainWindow.on('close', (e) => {
    if (process.platform === 'win32' && app.isPackaged) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })
}
// 监听关闭事件
ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close()
})
ipcMain.on('close', () => {
  if (mainWindow) mainWindow.minimize()
})
// Electron 应用初始化完成后的回调
// 只有在 Electron 完成初始化并准备创建浏览器窗口后才会调用此方法
// 某些 API 只能在此事件发生后使用
app.whenReady().then(() => {
  // 设置 Windows 应用用户模型 ID
  electronApp.setAppUserModelId('com.electron')

  // 开发环境默认 F12 打开/关闭开发者工具
  // 生产环境忽略 CommandOrControl + R
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC 测试
  ipcMain.on('ping', () => console.log('pong'))

  // 创建主窗口
  createWindow()

  // 启动剪贴板监听
  startClipboardPolling()

  // 注册全局快捷键：Ctrl+O 打开/关闭历史面板
  const shortcut = process.platform === 'darwin' ? 'Command+O' : 'Control+O'
  try {
    globalShortcut.register(shortcut, () => {
      toggleWindowVisibility()
    })
  } catch (err) {
    console.error('注册全局快捷键失败', err)
  }

  // IPC 通信：历史记录相关通道
  ipcMain.handle('history:get', () => historyItems) // 获取历史记录
  ipcMain.handle('history:clear', () => {
    // 清空历史记录
    historyItems.splice(0, historyItems.length)
    mainWindow?.webContents.send('history:updated')
    return true
  })
  ipcMain.handle('history:selectById', (_evt, id: string) => {
    // 根据 ID 选择历史项
    const item = historyItems.find((h) => h.id === id)
    if (!item) return false

    if (item.kind === 'text') {
      // 复制文本到剪贴板
      clipboard.writeText(item.text)
      lastClipboardText = item.text
      addHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind: 'text',
        text: item.text,
        createdAt: Date.now()
      })
    } else if (item.kind === 'image') {
      try {
        // 复制图片到剪贴板
        const img = nativeImage.createFromDataURL(item.imageDataUrl)
        clipboard.writeImage(img)
        lastClipboardImageDataUrl = item.imageDataUrl
        addHistoryItem({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          kind: 'image',
          imageDataUrl: item.imageDataUrl,
          createdAt: Date.now()
        })
      } catch {
        return false
      }
    }

    // 选择后自动隐藏面板以提升工作流程效率
    // setTimeout(() => mainWindow?.hide(), 50)
    return true
  })

  // macOS 平台：点击 Dock 图标时重新创建窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口关闭时退出应用（macOS 除外）
// 在 macOS 上，应用程序及其菜单栏通常会保持活动状态，直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 应用即将退出时的清理工作
app.on('will-quit', () => {
  stopClipboardPolling() // 停止剪贴板监听
  globalShortcut.unregisterAll() // 注销所有全局快捷键
})
