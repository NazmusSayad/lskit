const fs = require('fs')
const path = require('path')

const { default: GetFiles } = require('../build/cjs/index.cjs')
module.exports = new GetFiles({ fs, path })
