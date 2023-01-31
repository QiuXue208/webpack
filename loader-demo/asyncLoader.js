module.exports = function (source) {
  const asyncFunc = this.async()
  setTimeout(() => {
    source += '走上人生巅峰'
    console.log(source)
    asyncFunc(null, source)
  }, 200)
}