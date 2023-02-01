import { a } from './a'
import Comp from './comp.jsx'

const b = import('./b')

import { c } from './c.ts'

const init = () => {
  console.log(a)
  console.log(b)
  console.log(Comp)
  console.log(c)
}

init()