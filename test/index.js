console.clear()
import getFiles from '../package/index.mjs'
;(async () => {
  const target = '.'

  console.log(getFiles.sync(target))
  console.log(await getFiles.async(target))
})()
