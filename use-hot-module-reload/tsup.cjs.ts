import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['src/use-hot-module-reload.cts'],
  splitting: false,
  sourcemap: true,
  clean: false,
  format: 'cjs',
  dts: true,
})
