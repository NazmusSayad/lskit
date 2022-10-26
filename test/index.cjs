console.clear()
const { default: getFiles } = require('../package/build/cjs/index.cjs')
;(async () => {
  const target = '.'

  console.log(getFiles.sync(target))
  console.log(await getFiles.async(target))
})()
