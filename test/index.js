console.clear()
import getFiles from '../package/build/mjs/index.js'
;(async () => {
  const target = '.'

  console.log(getFiles.sync(target))
  console.log(await getFiles.async(target))
})()
