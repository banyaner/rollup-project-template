import config from './rollup.base'
import pkg from '../package.json'

export default config({
  format: 'es',
  file: `lib/${pkg.name}.es.js`,
  browser: true
})
