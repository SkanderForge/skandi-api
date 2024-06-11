import AdmZip from 'adm-zip'
import fs from 'node:fs'
import * as os from 'os'

export async function unzipToDirectory(zipFilePath: string, archiveName: string): Promise<string> {
  const archive = new AdmZip(zipFilePath)
  const unzipPath = `${os.tmpdir()}/${archiveName}/`

  if (!fs.existsSync(unzipPath)) {
    await fs.promises.mkdir(unzipPath, { recursive: true })
    console.log(archive.getEntries())
    archive.extractAllTo(unzipPath, true)
  }
  return unzipPath
}
