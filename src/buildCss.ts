import path from 'path'

export default async (targets: unknown[])=> {
    // first create css file
    generator.generate(targets.join(' ')).then(async (target) => {
        const tmpFilePath = path.resolve(sourceDir, filename)
        const data = new Uint8Array(Buffer.from(`${target.css}`))
        if (!target.css) {
          console.error('Error', 'css is empty')
          return undefined
        }
        await fs.writeFile(tmpFilePath, data, 'utf-8')
        // then add css to code
    })
}