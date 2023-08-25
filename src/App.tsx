import VueComponent from "./VueComponent";
 
class App extends VueComponent {
  setup() {
    // 可以通过 ref 声明状态
    // setup 只在初始化时执行一次，所以通过 ref 声明状态时条件、循环也没有关系
    const a = this.ref(0)
    const b = this.ref(0)

    // 某种依赖于值的副作用，不需要声明依赖项，自动依赖追踪
    this.watchEffect(() => {
      console.log("A 点击次数：", a.value)
    })
    this.watchEffect(() => {
      console.log("B 点击次数：", b.value)
    })
    
    // 编写视图，相当于以前的 render，不过可以直接用闭包引用状态，和 this 没有关系
    this.template = () => {
      return (
        <div>
          <button onClick={() => a.value++}>
            A 按钮 { a.value }
          </button>
          <button onClick={() => b.value++}>
            B 按钮 { b.value }
          </button>
        </div>
      )
    }
  }
}

export default App
