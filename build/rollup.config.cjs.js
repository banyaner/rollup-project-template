import config from './rollup.base'
import pkg from '../package.json'

export default config({
  format: 'cjs',
  file: `lib/${pkg.name}.cjs.js`,
  browser: true
})
