// 导入 Electron 工具包预加载模块的类型定义
import { ElectronAPI } from '@electron-toolkit/preload'

// 全局类型声明
declare global {
  interface Window {
    // Electron API 接口
    electron: ElectronAPI

    // 自定义 API 接口类型定义
    api: {
      // 获取剪贴板历史记录
      getHistory: () => Promise<
        (
          | { id: string; kind: 'text'; text: string; createdAt: number }
          | { id: string; kind: 'image'; imageDataUrl: string; createdAt: number }
        )[]
      >

      // 清空历史记录
      clearHistory: () => Promise<boolean>

      // 根据 ID 选择历史项并复制到剪贴板
      selectHistoryById: (id: string) => Promise<boolean>

      // 监听历史记录更新事件
      onHistoryUpdated: (cb: () => void) => () => void

      closeWindow: () => void

      close: () => void
    }
  }
}
