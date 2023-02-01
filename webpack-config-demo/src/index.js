import { a } from './a'
import Comp from './comp.jsx'

const b = import('./b')

const init = () => {
  console.log(a)
  console.log(b)
  console.log(Comp)
}

init()