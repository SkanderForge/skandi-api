import app from '@adonisjs/core/services/app'
import { inject } from '@adonisjs/core'
import fs, { readFileSync } from 'node:fs'
import logger from '@adonisjs/core/services/logger'
import BadFileException from '#exceptions/bad_file_exception'

@inject()
export default class SkanderKitService {
  private c2p: any
  private b2v: any

  constructor() {
    this.b2v = app.config.get('b2v-service')
    this.c2p = app.config.get('c2p-service')
  }
  async fileToJson(fileSrc: string) {
    const fileContents = readFileSync(fileSrc)
    this.c2p.FS.writeFile('/file.meow', fileContents)
    console.log('meow')
    try {
      const data = this.c2p.cfile2json('/file.meow')
      return data
    } catch (err) {
      logger.info(err)
      throw new BadFileException()
    }
  }
  async fileToObj(fileSrc: string) {
    if(fs.existsSync(fileSrc)){
      return JSON.parse(await this.fileToJson(fileSrc))
    }else{
      console.error(`${fileSrc} is not exist`)
    }
    return {}
  }
  async filesToObj(filesSrc:string[]) {
    let res: Record<string,unknown> = {}
    for(const fileSrc of filesSrc){
      res = {...res, ...await this.fileToObj(fileSrc)}
    }
    return res
  }


  async fileToGeoJson(fileSrc: string) {
    const fileContents = readFileSync(fileSrc).toString('binary')
    try {
      return this.b2v.bmp2geojson(fileContents)
    } catch (err) {
      logger.info(err)
      throw new BadFileException()
    }
  }
}
