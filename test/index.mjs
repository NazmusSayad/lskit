console.clear()
import path from 'path';
import getFiles from '../dist/mjs/index.js'
;(async () => {
  const target = path.resolve('.')

  console.log(getFiles.sync(target))
  console.log(await getFiles.async(target))
})()
