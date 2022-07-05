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
  const pathRead = path.resolve(path.dirname(__filename), fp || '')
  if (await pathExists(pathRead))
    return fs.readFile(pathRead, 'utf8')
  return null
}

// // abosolute path
// getFile('../package.json').then((x) => {
//   // eslint-disable-next-line no-console
//   console.log(x)
// })
