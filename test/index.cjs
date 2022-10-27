console.clear()
const path = require('path')
const { default: getFiles } = require('../dist/cjs/index.js')
;(async () => {
  const target = path.resolve('.')

  console.log(getFiles.sync(target))
  console.log(await getFiles.async(target))
})()
