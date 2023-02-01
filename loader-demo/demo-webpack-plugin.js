const { compilation } = require("webpack")

// 打包的时候自动生成一个md文档
class DemoWebpackPlugin {
  constructor() {
    console.log('plugin init')
  }
  apply(compiler) {
    // compiler 是一个webpack实例
    compiler.hooks.compile.tap('DemoWebpackPlugin', compilation => console.log(DemoWebpackPlugin))
    compiler.hooks.emit.tapAsync('DemoWebpackPlugin', (compilation, fn) => {
      compilation.assets['index.md'] = {
        source: function() {
          return 'this is a demo for plugin'
        },
        size: function() {
          return 25
        }
      }
      fn()
    })
  }
}

module.exports = DemoWebpackPlugin