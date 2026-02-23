import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  target: 'bun',
  minify: true,
  plugins: [dts()],
})
