import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/use-hot-module-reload.mts'],
  splitting: false,
  sourcemap: true,
  clean: false,
  format: 'esm',
  dts: true,
})
