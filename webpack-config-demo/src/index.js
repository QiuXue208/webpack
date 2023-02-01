import { a } from './a'
import Comp from './comp.jsx'
import Comp2 from './comp2.tsx'

const b = import('./b')

import { c } from './c.ts'

const init = () => {
  console.log(a)
  console.log(b)
  console.log(Comp)
  console.log(Comp2)
  console.log(c)
}

init()