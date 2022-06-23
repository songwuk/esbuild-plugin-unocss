import * as esbuild from 'esbuild'
import esbuildPluginUnocss from '../dist/index.js'

esbuild
  .build({
    entryPoints: ["in.css"],
    bundle: true,
    splitting: false,
    plugins: [esbuildPluginUnocss({alias: 'ts',})],
    outfile: "public/dist/index.css",
  })
.catch((e) => console.error(e.message));