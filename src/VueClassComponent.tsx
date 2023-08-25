import React from "react";

class VueComponent extends React.Component {
  template: any = undefined
  state = {
    count: 1
  }
  
  constructor(props) {
    super(props)
    this.setup()
  }

  // 副作用依赖收集
  _currentEffectCallback = null

  watchEffect(cb) {
    this._currentEffectCallback = cb
    cb()
    this._currentEffectCallback = null
  }

  update() {
    this.setState({ count: this.state.count + 1 })
  }

  // ref 状态声明
  ref(initValue: any) {
    const that = this
    const refObj = {
      value: initValue,
      // 使用了这个状态的副作用
      refCallbcak: [] as any[],
    }
    return new Proxy(refObj, {
      get(target, key) {
        // 是否是在副作用依赖收集期间触发，如果是就开始收集依赖
        if(that._currentEffectCallback) {
          refObj.refCallbcak.push(that._currentEffectCallback)
        }
        return target[key]
      },
      set(target, key, value) {
        target[key] = value
        that.update()
        // 当前值变化，触发依赖回调
        for(const callback of refObj.refCallbcak) {
          callback()
        }
        return true
      },
    })
  }

  render() {
    return this.template()
  }

  setup() {}
}

export default VueComponent