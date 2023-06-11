const ls = require('./dist-cjs/index')

console.log(
  ls.sync('.', {
    filter(pah) {
      console.log(pah.path)
    },
  })
)
// ls.async('.').then(console.log)
