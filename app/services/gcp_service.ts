import { inject } from '@adonisjs/core'
import { Storage } from '@google-cloud/storage'
import fs from 'node:fs'
import NoFileException from '#exceptions/no_file_exception'
import * as crypto from 'crypto'
const SAVES_BUCKET = 'skandi-savefiles'
const DATAFILES_BUCKET = 'skandi-public-files'
//const ARCHIVES_BUCKET = 'skandi-dataset-archives'

@inject()
export default class GcpService {
  constructor(protected gcpInstance: Storage) {}
  async getAllSaveFiles() {
    return this.gcpInstance.bucket(SAVES_BUCKET).getFiles()
  }

  async uploadSaveFile(path: string) {
    if (!fs.existsSync(path)) throw new NoFileException()
    const fileHash = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')

    const upload = await this.gcpInstance.bucket(SAVES_BUCKET).upload(path, {
      destination: `/${fileHash}-test.eu4`,
      metadata: { metadata: { meow: false } },
    })
    return !!upload
  }

  async uploadPublicFile(path: string, destination: string) {
    if (!fs.existsSync(path)) throw new NoFileException()

    const upload = await this.gcpInstance
      .bucket(DATAFILES_BUCKET)
      .upload(path, { destination: destination })

    return !!upload
  }
}
