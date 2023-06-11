import { Options } from './types'

export const defaultConfig: Options = {
  excludeFolders: ['node_modules', '.git', '.cache'],
  minSize: 0,
  maxSize: Infinity,
  relative: false,
}
