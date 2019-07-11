import config from './rollup.base'
import pkg from '../package.json'

export default config({
  format: 'cjs',
  file: `lib/${pkg.name}.node.cjs.js`,
  browser: false // 打包node环境下的代码时，第三方模块broswer相关代码不用打包
})
