import fs from 'fs'
import path from 'path'
import cmd from 'child_process'

const mjs = 'tsc -p tsconfig-mjs.json'
const cjs = 'tsc -p tsconfig-cjs.json'

const buildDir = path.resolve('./build')
const cjsDir = path.join(buildDir, './cjs')

const getCjs = (file) => {
  return file.replace(/(js|ts)$/, (mat) => 'c' + mat)
}

console.clear()
console.log('Cleaning build dir...')
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { force: true, recursive: true })
}

console.log('Build started....')

cmd.execSync(mjs)
console.log('ESmodule build finished...')

cmd.execSync(cjs)
console.log('CommonJs build finished...')

// Replace js => cjs
;(async () => {
  console.log("Replacing 'js' -> 'cjs'")
  const { default: getFiles } = await import('./package/index.mjs')
  const files = getFiles.sync(cjsDir, {
    relative: true,
    separator: '/',
    prefix: './',
  })

  const replaceCjs = (data) => {
    files.forEach((file) => {
      data = data.replace(file, getCjs(file))
    })
    return data
  }

  files.forEach((file) => {
    const realPath = path.join(cjsDir, file)
    const data = fs.readFileSync(realPath, 'utf8')

    fs.writeFileSync(getCjs(realPath), replaceCjs(data))
    fs.rmSync(realPath)
  })
})()
