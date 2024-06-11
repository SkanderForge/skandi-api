import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs'

export default class PrepareWasm extends BaseCommand {
  static commandName = 'prepare:wasm'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    let script = fs.readFileSync('./providers/b2v_wasm.js').toString()

    if (!script.includes('export default')) {
      script =
        `import { createRequire } from 'module';\n
          const require = createRequire(import.meta.url);\n
          import { fileURLToPath } from 'url';\n
          import { dirname } from 'path';\n

          const __filename = fileURLToPath(import.meta.url);\n
          const __dirname = dirname(__filename);\n` +
        script +
        `\nexport default b2vwasm;`
      console.log(script)
    }
    fs.writeFileSync('./providers/b2v_wasm.js', script)

    script = fs.readFileSync('./providers/c2p_wasm.js').toString()

    if (!script.includes('export default')) {
      script =
        `import { createRequire } from 'module';\n
        const require = createRequire(import.meta.url);\n
        import { fileURLToPath } from 'url';\n
        import { dirname } from 'path';\n

        const __filename = fileURLToPath(import.meta.url);\n
        const __dirname = dirname(__filename);\n` +
        script +
        `\nexport default c2pwasm;`
      console.log(script)
    }
    fs.writeFileSync('./providers/c2p_wasm.js', script)
  }
}
