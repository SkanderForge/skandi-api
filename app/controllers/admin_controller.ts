import type { HttpContext } from '@adonisjs/core/http'
import { uploadDatasetValidator } from '#validators/admin'
import NoFileException from '#exceptions/no_file_exception'
import { unzipToDirectory } from '../utilities/zipper.js'
import EU4DatasetProcessorService from '#services/dataset_processors/eu4_processor_service'
import * as os from 'os'
import { inject } from '@adonisjs/core'
import { Dataset } from '#entities/dataset.entity'
import DatabaseService from '#services/database_service'
import crypto from "node:crypto"
import {Datafile} from "#entities/datafile.entity";

@inject()
export default class AdminController {
  constructor(
    protected eu4processor: EU4DatasetProcessorService,
    protected databaseService: DatabaseService
  ) {}

  async addDataset({ request }: HttpContext) {
    try {
      const payload = await request.validateUsing(uploadDatasetValidator)
      const em = this.databaseService.getEntityManager()

      if (!payload.archive.tmpPath) {
        return new NoFileException()
      }
      console.log(os.tmpdir())
      const unzipPath = await unzipToDirectory(payload.archive.tmpPath, `${payload.key}-${crypto.randomBytes(2).toString('hex')}`)

      console.log(unzipPath, 'done!')

      const datasets = await this.eu4processor.setDataSrc(unzipPath).setInput(payload).process()
      console.log(datasets)

      const existingEntity = await em.findOne(Dataset, { key: payload.key })
      if (existingEntity) {
        //TODO figure out why cascade remove doesn't work and we need to remove datafiles manually.
        const datafiles = await em.find(Datafile, {belongsTo:existingEntity})
        await em.removeAndFlush(datafiles)
        await em.removeAndFlush(existingEntity)
      }
      const dataset = new Dataset(payload.key,payload.gameVersion)
      dataset.datafiles.add(datasets)
      dataset.name = payload.alias
      dataset.mapShapefileUrl = `${payload.key}/provinces.js`
      dataset.key = payload.key
      dataset.isVanilla = true
      await em.persistAndFlush(dataset)


    } catch (err) {
      return err
    }
    return {}
  }
}
