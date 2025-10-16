// 导入 Electron 预加载相关模块
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义 API 接口，用于渲染进程与主进程通信
const api = {
  // 获取剪贴板历史记录
  getHistory: (): Promise<
    (
      | { id: string; kind: 'text'; text: string; createdAt: number }
      | { id: string; kind: 'image'; imageDataUrl: string; createdAt: number }
    )[]
  > => ipcRenderer.invoke('history:get'),

  // 清空历史记录
  clearHistory: (): Promise<boolean> => ipcRenderer.invoke('history:clear'),

  // 根据 ID 选择历史项并复制到剪贴板
  selectHistoryById: (id: string): Promise<boolean> => ipcRenderer.invoke('history:selectById', id),

  // 监听历史记录更新事件
  onHistoryUpdated: (cb: () => void): (() => void) => {
    const listener = (): void => cb()
    ipcRenderer.on('history:updated', listener)
    return () => ipcRenderer.removeListener('history:updated', listener)
  },
  closeWindow: () => ipcRenderer.send('window-close'),
  close: () => ipcRenderer.send('close')
}

// 使用 `contextBridge` API 将 Electron API 暴露给渲染进程
// 仅在启用上下文隔离时使用，否则直接添加到 DOM 全局对象
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
