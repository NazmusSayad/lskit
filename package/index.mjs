import fs from 'fs'
import path from 'path'

import GetFiles from '../build/mjs/index.js'
export default new GetFiles({ fs, path })
