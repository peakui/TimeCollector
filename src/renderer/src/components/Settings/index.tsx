import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from './index.module.scss'
import { CodeTwoTone, CopyTwoTone, EyeTwoTone, SunOutlined, MoonOutlined } from '@ant-design/icons'
import { Flex, Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setLight, setNight } from '@renderer/store/modules/counterStore'
import type { RootState } from '../../store'

function Settings(): React.JSX.Element {
  const [value, setValue] = useState(2)
  const { count } = useSelector((state: RootState) => state.counter)
  const dispath = useDispatch()
  useEffect(() => {
    setValue(count)
  }, [count])
  const onChange = (e: RadioChangeEvent): void => {
    setValue(e.target.value)
    if (e.target.value == 1) {
      dispath(setLight())
    }
    if (e.target.value == 2) {
      dispath(setNight())
    }
  }
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <div className={styles.leftBox}>
          <div className={styles.leftItem}>
            <div className={styles.leftTitle}>
              <CodeTwoTone />
              <div className={styles.leftTexts}>打开/隐藏剪切板</div>
            </div>
            <div className={styles.leftContent}>
              <div className={styles.leftContentLeft}>快捷键</div>
              <div className={styles.leftContentRight}>Ctrl + O</div>
            </div>
          </div>
          <div className={styles.leftItem}>
            <div className={styles.leftTitle}>
              <CopyTwoTone />
              <div className={styles.leftTexts}>复制剪切板内容</div>
            </div>
            <div className={styles.leftContent}>
              <div className={styles.leftContentLeft}>快捷键</div>
              <div className={styles.leftContentRight}>双击</div>
            </div>
          </div>
        </div>
        <div className={styles.rightBox}>
          <div className={styles.rightItem}>
            <div className={styles.rightTitle}>
              <EyeTwoTone />
              <div className={styles.rightTexts}>主题颜色</div>
            </div>
            <div className={styles.rightContent}>
              <Radio.Group
                className={styles.radioStyle}
                onChange={onChange}
                value={value}
                options={[
                  {
                    value: 1,
                    className: 'option-1',
                    label: (
                      <Flex gap="small" justify="center" align="center" vertical>
                        <SunOutlined className={styles.radioText} />
                        <div className={styles.radioText}>浅色</div>
                      </Flex>
                    )
                  },
                  {
                    value: 2,
                    className: 'option-2',
                    label: (
                      <Flex gap="small" justify="center" align="center" vertical>
                        <MoonOutlined className={styles.radioText} />
                        <div className={styles.radioText}>深色</div>
                      </Flex>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
