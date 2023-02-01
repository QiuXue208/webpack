import { a } from './a'

const b = import('./b')

const init = () => {
  console.log(a)
  console.log(b)
}

init()