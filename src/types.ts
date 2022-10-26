export interface Config {
  excludeFolder: string[]
  filter: RegExp | Function | false
  maxSize: number
  minSize: number
  relative: boolean
  separator: string | false
  prefix: string
  suffix: string
}

export const configDefault: Config = {
  excludeFolder: ['node_modules'],
  filter: false,
  maxSize: Infinity,
  minSize: 0,
  relative: false,
  separator: false,
  prefix: '',
  suffix: '',
}

export interface Worker {
  config: Config
  output: string[]
  targetDir: string
  rootDir: string
  content: string
  stats: {} | any
  read: Function
}
