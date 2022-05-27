# tsup-plugin-unocss

[![NPM version](https://img.shields.io/npm/v/tsup-plugin-unocss?color=a1b858&label=)](https://www.npmjs.com/package/tsup-plugin-unocss)


## Usage

Install esbuild and the plugin

```shell
npm install -D esbuild
npm install -D tsup-plugin-unocss
```

Set up a build script

```typescript
import { build } from 'esbuild';
import esbuildPluginUnocss from 'tsup-plugin-unocss'

async function myBuilder(){
  const buildResult = await build({
    entryPoints:[index]
    plugins: [
      esbuildPluginUnocss()
    ],
  });
}
```

Run your builder.
