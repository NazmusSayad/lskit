import * as path from 'path'

export interface FilterFn {
  (info: path.ParsedPath & { relative: string; path: string }): boolean
}

export interface Options {
  excludeFolders: string[]
  filter?: RegExp | FilterFn
  relative: boolean
  minSize: number
  maxSize: number
}
