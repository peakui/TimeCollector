import styles from './index.module.scss'
import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button, message, ConfigProvider, theme } from 'antd'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
// 历史记录项类型定义
type HistoryItem =
  | { id: string; kind: 'text'; text: string; createdAt: number } // 文本类型
  | { id: string; kind: 'image'; imageDataUrl: string; createdAt: number } // 图片类型

function History(): React.JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  const [bgColor, setBgColor] = useState(1)

  // 状态管理
  const [items, setItems] = useState<HistoryItem[]>([]) // 历史记录列表
  const [query, setQuery] = useState('') // 搜索查询字符串
  const [selectedIndex, setSelectedIndex] = useState(0) // 当前选中项的索引
  const { count } = useSelector((state: RootState) => state.counter)

  useEffect(() => {
    setBgColor(count)
  }, [count])
  // 组件挂载时加载历史记录并订阅更新事件
  useEffect(() => {
    const load = async (): Promise<void> => {
      const data = await window.api.getHistory()
      setItems(data)
    }

    load() // 初始加载
    const unsubscribe = window.api.onHistoryUpdated(load) // 订阅更新事件

    return () => {
      if (unsubscribe) unsubscribe() // 清理订阅
    }
  }, [])

  // 根据搜索查询过滤历史记录
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) =>
      i.kind === 'text' ? i.text.toLowerCase().includes(q) : 'image'.includes(q) || q === ''
    )
  }, [items, query])

  // 当过滤结果变化时，调整选中索引
  useEffect(() => {
    if (selectedIndex >= filtered.length) setSelectedIndex(0)
  }, [filtered, selectedIndex])

  // 键盘事件处理
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowDown') {
        // 向下箭头：选择下一项
        e.preventDefault()
        setSelectedIndex((v) => (filtered.length ? (v + 1) % filtered.length : 0))
      } else if (e.key === 'ArrowUp') {
        // 向上箭头：选择上一项
        e.preventDefault()
        setSelectedIndex((v) => (filtered.length ? (v - 1 + filtered.length) % filtered.length : 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [filtered, selectedIndex])

  const clickFn = async (id): Promise<void> => {
    await window.api.selectHistoryById(id)
    messageApi.open({
      type: 'success',
      content: '复制成功！'
    })
  }
  // 清空历史记录
  const onClear = async (): Promise<void> => {
    await window.api.clearHistory()
  }
  const { darkAlgorithm, defaultAlgorithm } = theme
  return (
    <ConfigProvider
      theme={{
        algorithm: bgColor == 1 ? defaultAlgorithm : darkAlgorithm
      }}
    >
      <div className={styles.layout}>
        <div className={styles.searchBox}>
          <div className={styles.searchItem}>
            <div className={styles.searchInput}>
              <div className={styles.searchIcon}>
                <SearchOutlined />
              </div>
              <div className={styles.searchContent}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="搜索"
                />
              </div>
            </div>
            <div className={styles.clearBtn}>
              <Button onClick={onClear} className={styles.clearBtnColor} variant="solid">
                清空
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.listBox}>
          {contextHolder}
          <div className={styles.listContent}>
            {filtered.map((item, idx) => (
              <div
                className={styles.listItem}
                key={item.id}
                onDoubleClick={() => clickFn(item.id)} // 双击复制
                onMouseEnter={() => setSelectedIndex(idx)} // 鼠标悬停选中
                onMouseLeave={() => setSelectedIndex(-1)}
                style={{
                  background: idx === selectedIndex ? 'var(--bg-dark)' : 'var(--bg-light)',
                  boxShadow: idx === selectedIndex ? 'var(--shadow-l)' : 'var(--shadow-m)'
                }}
              >
                <div className={styles.listCo}>
                  {item.kind === 'text' ? (
                    // 文本内容显示
                    <div className={styles.texts}>{item.text}</div>
                  ) : (
                    // 图片内容显示
                    <div className={styles.imgsBox}>
                      <div className={styles.imgs}>
                        <img
                          src={item.imageDataUrl}
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default History
