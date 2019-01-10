import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

export default [{
  input: 'index.js',
  plugins: [filesize()],
  output: {
    file: 'dist/labyrinth.js',
    format: 'umd',
    name: 'Labyrinth'
  }
}, {
  input: 'index.js',
  plugins: [terser(), filesize()],
  output: {
    file: 'dist/labyrinth.min.js',
    format: 'umd',
    name: 'Labyrinth'
  }
}]