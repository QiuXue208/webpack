const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const { TIMEOUT } = require('dns')

// 获取单个模块信息
const getModuleInfo = (filepath) => {
  // 读取文件内容
  const content = fs.readFileSync(filepath, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  const deps = {}
  // 收集依赖
  traverse(ast, {
    ImportDeclaration({ node }) {
      // 获取文件目录
      const dirname = path.dirname(filepath)
      const absPath = './' + path.join(dirname, node.source.value)
      deps[node.source.value] = absPath
    }
  })

  // 将代码转换成es5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  const moduleInfo = { filepath, deps, code }
  return moduleInfo
}

const parseModules = (filepath) => {
  // 定义依赖图
  const depsGraph = {}
  const entry = getModuleInfo(filepath)
  const temp = [entry]
  // 递归收集依赖
  for (let i = 0; i < temp.length; i++) {
    const item = temp[i]
    const deps = item.deps
    if (deps) {
      for (let k in deps) {
        if (Object.hasOwnProperty.call(deps, k)) {
          temp.push(getModuleInfo(deps[k]))
        }
      }
    }
  }
  temp.forEach((item) => {
    depsGraph[item.filepath] = {
      deps: item.deps,
      code: item.code
    }
  })
  return depsGraph
}

const bundle = (filepath) => {
  // 获取依赖图
  const depsGraph = JSON.stringify(parseModules(filepath))
  // 将依赖图中代码以字符串形式输出
  return `
    (function (graph) {
      function require(filepath) {
        var exports = {}
        function absRequire(relPath) {
          return require(graph[filepath].deps[relPath])
        }
        (function (require, exports, code){
          eval(code)
        })(absRequire, exports, graph[filepath].code)
        return exports
      }
      require('${filepath}')
    })(${depsGraph})
  `
}

const build = (filepath) => {
  const content = bundle(filepath)
  fs.mkdirSync('./dist')
  fs.writeFileSync('./dist/bundle.js', content)
}

build('./src/index.js')