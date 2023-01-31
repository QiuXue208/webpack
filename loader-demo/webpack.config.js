const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  // 指定loader查找路径
  resolveLoader: {
    // 从左往右查找
    modules: ['node_modules', './']
  },
  module: {
    rules: [
      {
        // js文件在打包前，先使用syncLoader处理
        test: /\.js$/,
        use: [
          { loader: 'syncLoader' },
          { loader: 'asyncLoader' }
        ]
      }
    ]
  }
}