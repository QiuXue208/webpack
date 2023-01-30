// 使用 「node -r ts-node/register 文件路径」 来运行，
// 如果需要调试，可以加一个选项 --inspect-brk，再打开 Chrome 开发者工具，点击 Node 图标即可调试
import { readFileSync } from 'fs'
import { resolve, relative, dirname } from 'path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as babel from '@babel/core'

// 根目录
const projectRoot = resolve(__dirname, 'project-bundle')

type DepRelation = { [key: string]: { deps: string[]; code: string } }
// 收集依赖关系
const depRelation: DepRelation = {}

// 将入口文件的绝对路径传入函数
collect(resolve(projectRoot, 'index.js'))

console.log(depRelation)

function collect(filepath: string) {
  const key = getProjectPath(filepath) // 文件的项目路径，如index.js
  if (Object.keys(depRelation).includes(key)) {
    // 重复依赖不一定是循环依赖
    return
  }

  // 获取文件内容，将内容放至 depRelation
  const code = readFileSync(filepath).toString()
  const newCode = babel.transform(code, {
    presets: ['@babel/preset-env']
  })
  depRelation[key] = { deps: [], code: newCode?.code ?? '' }

  // 将代码转为AST
  const ast = parse(code, { sourceType: 'module' })
  // 分析文件依赖，将内容放至 depRelation
  traverse(ast, {
    enter: path => {
      if (path.node.type === 'ImportDeclaration') {
        // path.node.source.value 往往是一个相对路径，如 ./a.js，需要先把它转为一个绝对路径
        const depAbsolutePath = resolve(dirname(filepath), path.node.source.value)
        // 然后转为项目路径
        const depProjectPath = getProjectPath(depAbsolutePath)
        // 把依赖写进depRelation
        depRelation[key].deps.push(depProjectPath)
        collect(depAbsolutePath)
      }
    }
  })
}

function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, '/')
}