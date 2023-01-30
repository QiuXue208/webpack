import b from './b.js';
const a = {
  value: 'a',
  getA() {
    return b.value + 'from a.js';
  },
};
export default a;