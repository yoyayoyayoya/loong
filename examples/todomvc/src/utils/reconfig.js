const path = require('path')
const fs = require('fs')

const CFG_PATH = path.resolve(
  __dirname,
  '../../node_modules/react-scripts/config'
)
console.info(`checking configuration path: ${CFG_PATH}`)
if (fs.existsSync(CFG_PATH)) {
  console.info(`start replacing webpack and jest configuration files`)
  fs.copyFileSync(
    path.resolve(__dirname, 'webpack.config.dev.js'),
    path.resolve(CFG_PATH, 'webpack.config.dev.js')
  )
  fs.copyFileSync(
    path.resolve(__dirname, './webpack.config.prod.js'),
    path.resolve(CFG_PATH, 'webpack.config.prod.js')
  )
  fs.copyFileSync(
    path.resolve(__dirname, './babelTransform.js'),
    path.resolve(CFG_PATH, 'jest/babelTransform')
  )
}
