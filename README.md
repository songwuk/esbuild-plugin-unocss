# tsup-plugin-unocss

[![NPM version](https://img.shields.io/npm/v/tsup-plugin-unocss?color=a1b858&label=)](https://www.npmjs.com/package/tsup-plugin-unocss)


## Usage

Install tsup and the plugin

```shell
npm install -D tsup
npm install -D tsup-plugin-unocss
```

Set up a build script

```typescript
import { defineConfig } from 'tsup';
import defineConfig from 'tsup-plugin-unocss'

async function myBuilder(){
  const buildResult = await defineConfig({
    entry:[index.ts]
    esbuildPlugins: [
      esbuildPluginUnocss()
    ],
  });
}
```

Run your builder.
