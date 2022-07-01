import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
const pathExists = (fp: string) =>
  new Promise((resolve) => {
    fs.access(fp, (err) => {
      resolve(!err)
    })
  })

const __filename = fileURLToPath(import.meta.url) // 当前所在的文件地址
export async function getFile(fp: string) {
  if (await pathExists(fp))
    return fs.readFile(fp, 'utf8')
  return null
}

getFile(path.resolve(path.dirname(__filename), '../package.json')).then((x) => {
  // eslint-disable-next-line no-console
  console.log(x)
})
