# tsup-plugin-unocss
An tsup plugin which uses babel build css and js.

[![NPM version](https://img.shields.io/npm/v/tsup-plugin-unocss?color=a1b858&label=)](https://www.npmjs.com/package/tsup-plugin-unocss)


## ⚠️Usage 

Install tsup and the plugin

```shell
npm install -D tsup
npm install -D tsup-plugin-unocss
```
or
```shell
pnpm add -D tsup
pnpm add -D tsup-plugin-unocss
```
Set up a build script

```typescript
import { defineConfig } from 'tsup';
import esbuildPluginUnocss from 'tsup-plugin-unocss'

async function myBuilder(){
  const buildResult = await defineConfig({
    entry:[index.ts]
    esbuildPlugins: [
      esbuildPluginUnocss({
        alias: '.',
      })
    ],
  });
}
```

Run your builder.
