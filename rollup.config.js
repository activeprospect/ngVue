import babel from '@rollup/plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'

const entry = process.env.ENTRY
const output = process.env.OUTPUT
const minified = process.env.MIN === 'true'

export default {
  input: `src/${entry}.js`,
  output: {
    file: `build/${output}.js`,
    name: 'ngVue',
    globals: {
      vue: 'Vue',
      angular: 'angular'
    },
    format: 'umd'
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    babel(),
    commonjs({
      namedExports: {
        'node_modules/babel-helper-vue-jsx-merge-props/index.js': ['_mergeJSXProps']
      }
    }),
    uglify(minified ? {} : {
      output: {
        beautify: true
      },
      mangle: false
    }, minify)
  ],
  external: ['vue', 'angular']
}
