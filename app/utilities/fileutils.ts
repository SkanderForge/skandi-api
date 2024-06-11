import fs from 'node:fs'

export function readFilename(filePath: string) {
  const extension = filePath.split('.').pop()
  const path = filePath.split('/').pop() ?? false
  const fileSplit = (filePath.split(`/`).at(-1) as string).split('.')
  fileSplit.pop()
  const filename = fileSplit.join('.')
  return {
    path: path,
    extension: extension,
    name: filename,
  }
}

export async function getFilesFromDirectory(
  directory: string,
  includeDir = false,
  recursively = false
) {
  let files = await fs.promises.readdir(directory, { recursive: recursively })
  includeDir
    ? (files = files.map((fileName) => {
        return `${directory}/${fileName}`
      }))
    : ''
  return files
}
