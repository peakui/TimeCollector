// 导入 css 样式
import './assets/sass/base.scss'
// 导入图片
import icon from './assets/icon.png'
// 导入 React 相关 hooks
import { useEffect, useState } from 'react'
import { HistoryOutlined, SettingOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons'
import History from './components/History'
import Settings from './components/Settings'
import { useSelector } from 'react-redux'
import type { RootState } from './store'
/**
 * 主应用组件 - 剪贴板历史记录面板
 */
function App(): React.JSX.Element {
  const [clickIndex, setClickIndex] = useState(1)
  const { count } = useSelector((state: RootState) => state.counter)
  const [themeId, setThemeId] = useState(2)

  useEffect(() => {
    setThemeId(count)
  }, [count])
  const closes = async (): Promise<void> => {
    window.api.close()
  }
  const closeWins = async (): Promise<void> => {
    window.api.closeWindow()
  }

  return (
    <div className={`layout ${themeId == 1 ? 'light' : ''}`}>
      <div className="box">
        <div className="sidebarLeft">
          <div className="sLContent">
            <div className="logo">
              <div className="logoBox">
                <div className="logoImg">
                  <img src={icon} alt="" />
                </div>
                <div className="logoTxt">拾光</div>
              </div>
            </div>
            <div className="tabbar">
              <div className="tabbarItem">
                <div
                  className={`tabContent ${clickIndex == 1 ? 'active' : ''}`}
                  onClick={() => setClickIndex(1)}
                >
                  <HistoryOutlined />
                  <div className="textMp">记录</div>
                </div>
              </div>
              <div className="tabbarItem">
                <div
                  className={`tabContent ${clickIndex == 2 ? 'active' : ''}`}
                  onClick={() => setClickIndex(2)}
                >
                  <SettingOutlined />
                  <div className="textMp">设置</div>
                </div>
              </div>
            </div>
            <div className="info">v1.0.0</div>
          </div>
        </div>
        <div className="sidebarRight">
          <div className="sRTop">
            <div className="sRTopBox"></div>
            <div className="topIcon">
              {/* <PushpinOutlined className="text" /> */}
              <MinusOutlined onClick={() => closes()} className="text" />
              {/* <BorderOutlined className="text" /> */}
              <CloseOutlined onClick={() => closeWins()} className="text" />
            </div>
          </div>
          <div className="sRContent">
            <div className="sRBox">{clickIndex == 1 ? <History /> : <Settings />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
