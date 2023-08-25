import { useState } from "react"

export const createVueComponent = (setup: any) => {
  // 渲染模板
  let template: any = null
  const setTemplate = (v) => template = v
  
  // 依赖收集
  let currentEffectCallback = null
  const watchEffect = (cb) => {
    currentEffectCallback = cb
    cb()
    currentEffectCallback = null
  }

  // 刷新组件
  let _refresh: any = null
  const refreshComponent = () => {
    _refresh()
  }

  // 声明状态
  const ref = (initValue: any) => {
    const refObj = {
      value: initValue,
      // 使用了这个状态的副作用
      refCallbcak: [] as any[],
    }
    return new Proxy(refObj, {
      get(target, key) {
        // 是否是在副作用依赖收集期间触发，如果是就开始收集依赖
        if(currentEffectCallback) {
          refObj.refCallbcak.push(currentEffectCallback)
        }
        return target[key]
      },
      set(target, key, value) {
        target[key] = value
        refreshComponent()
        // 当前值变化，触发依赖回调
        for(const callback of refObj.refCallbcak) {
          callback()
        }
        return true
      },
    })
  }
  setup({
    ref,
    watchEffect,
    setTemplate,
  })
  return () => {
    const [_, setState] = useState({})
    _refresh = () => setState({})
    return template()
  }
}

export default createVueComponent