console.clear()
const getFiles = require('../package/index.cjs')
;(async () => {
  const target = '.'

  console.log(getFiles.sync(target))
  console.log(await getFiles.async(target))
})()
