import config from './rollup.base'
import pkg from '../package.json'

export default config({
  format: 'cjs',
  file: `lib/${pkg.name}.node.cjs.js`,
  browser: true
})
