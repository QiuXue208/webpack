import a from './a.js';
const b = {
  value: 'b',
  getB() {
    return a.value + 'from b.js';
  },
};
export default b;