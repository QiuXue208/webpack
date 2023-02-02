import { a } from '@/a.js'
import Comp from './comp.jsx'
import Comp2 from './comp2.tsx'
import '@/styles/index.scss'
import vars from '@/styles/export-vars.scss'

const b = import('./b')

import { c } from './c.ts'
import d from '@/utils/d.ts'

const init = () => {
  console.log(a)
  console.log(b)
  console.log(Comp)
  console.log(Comp2)
  console.log(c)
  console.log(d)
  console.log(vars)
  console.log('热更新')
}

init()