import * as fs from 'fs'
import * as path from 'path'
import { defaultConfig } from '../config'
import { Options } from '../types'

export default function (base: string, options = {} as Partial<Options>) {
  const conf = { ...defaultConfig, ...options }
  const excludedDirs = new Set(conf.excludeFolders)
  const basePath = path.resolve(base)

  function readDir(dir: string) {
    const children = fs.readdirSync(dir)

    children.forEach((child) => {
      if (excludedDirs.has(child)) return

      const fullPath = path.join(dir, child)
      const relativePath = path.relative(basePath, fullPath)
      const targetPath = conf.relative ? relativePath : fullPath
      const stats = fs.lstatSync(fullPath)

      if (stats.isDirectory()) return readDir(fullPath)
      if (stats.size > conf.maxSize || stats.size < conf.minSize) return
      if (conf.filter instanceof RegExp && !conf.filter.test(targetPath)) return
      if (
        conf.filter instanceof Function &&
        !conf.filter({
          ...path.parse(fullPath),
          relative: relativePath,
          path: fullPath,
        })
      ) {
        return
      }

      files.push(targetPath)
    })
  }

  const files: string[] = []
  readDir(basePath)
  return files
}
