import fs from 'fs'
import path from 'path'
import * as types from './types.js'

// let fs: any
// let path: any

class GetFiles {
  // constructor({ fs: fsObj, path: pathObj }: { fs: {}; path: {} }) {
  //   // fs = fsObj
  //   // path = pathObj
  // }

  sync(targetDir: string, config: types.Config): string[] {
    const output: string[] = []

    const read = (rootDir: string) => {
      const files = fs.readdirSync(rootDir)

      files.forEach((content) => {
        const stats = fs.lstatSync(path.join(rootDir, content))
        const newDir = this.#worker({
          targetDir,
          config,
          read,
          output,
          rootDir,
          content,
          stats,
        })
        newDir && read(newDir)
      })
    }

    read(targetDir)
    return output
  }

  async async(targetDir: string, config: types.Config): Promise<string[]> {
    const output: string[] = []

    const read = async (rootDir: string) => {
      const files = await fs.promises.readdir(rootDir)

      for (let content of files) {
        const stats = await fs.promises.lstat(path.join(rootDir, content))
        const newDir = this.#worker({
          targetDir,
          config,
          read,
          output,
          rootDir,
          content,
          stats,
        })
        newDir && (await read(newDir))
      }
    }

    await read(targetDir)
    return output
  }

  #worker({
    targetDir,
    config,
    output,
    rootDir,
    content,
    stats,
  }: types.Worker) {
    // Set default config :)
    config = Object.assign({ ...types.configDefault }, config)

    // If target is a dir then return the dir path
    if (stats.isDirectory()) {
      if (config.excludeFolder.includes(content)) return
      return path.join(rootDir, content)
    }

    // If everything is ok :)
    const fullPath = path.join(rootDir, content)
    const relativePath = path.relative(targetDir, fullPath)
    let filePath = config.relative ? relativePath : fullPath

    // Size limit
    if (stats.size > config.maxSize || stats.size < config.minSize) return

    // Filter with RegExp
    if (config.filter instanceof RegExp && !config.filter.test(filePath)) return

    // Filter with a function
    if (
      config.filter instanceof Function &&
      !config.filter(path.parse(fullPath), relativePath, fullPath)
    ) {
      return
    }

    // Replace separator if needed
    if (config.separator) {
      filePath = filePath.replace(/\/|\\/gim, config.separator)
    }

    // If all checks are passed then add to output
    output.push(config.prefix + filePath + config.suffix)
  }
}

export default new GetFiles()
