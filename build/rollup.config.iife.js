import config from './rollup.base'
import pkg from '../package.json'

export default config({
  format: 'iife',
  file: pkg.main, // 默认对外的是在浏览器上运行的iife
  browser: true
})
