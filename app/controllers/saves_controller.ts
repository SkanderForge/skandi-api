import type { HttpContext } from '@adonisjs/core/http'
import { uploadSaveFileValidator } from '#validators/saves'
import fs from 'node:fs'
import NoFileException from '#exceptions/no_file_exception'
import { unzipToDirectory } from '../utilities/zipper.js'
import SkanderKitService from '#services/skander_kit_service'
import { inject } from '@adonisjs/core'
import BadFileException from '#exceptions/bad_file_exception'
import { readFilename } from '../utilities/fileutils.js'
import { GamesEnum } from '../types/index.js'
import { Save } from '#entities/save.entity'
import DatabaseService from '#services/database_service'
import { User } from '#entities/user.entity'
import { Dataset } from '#entities/dataset.entity'
import { randomBytes } from 'node:crypto'
import SaveFileDoesNotExistException from '#exceptions/savefile_does_not_exist_exception'
import SaveFileMalformedException from '#exceptions/savefile_malformed_exception'
import DatasetHandlerService from '#services/dataset_handler_service'
import { SaveProcessorFactory } from '#factories/SaveProcessorFactory'
import EU4SaveProcessorService from '#services/savefile_processors/eu4_save_processor_service'

@inject()
export default class SavesController {
  constructor(
    protected skanderKit: SkanderKitService,
    protected databaseService: DatabaseService,
    protected datasetHandlerService: DatasetHandlerService,
    protected saveProcessorFactory: SaveProcessorFactory
  ) {}

  async uploadNewSave({ request }: HttpContext) {
    const payload = await request.validateUsing(uploadSaveFileValidator)
    const file = payload.file

    if (!file.tmpPath) {
      return new NoFileException()
    }
    let fileContents = await fs.promises.readFile(file.tmpPath)
    const extension = readFilename(file.clientName).extension
    let res

    //Remove Victoria3 savefile header
    if (fileContents[0] == 83 && fileContents[1] == 65 && fileContents[2] == 86) {
      fileContents = fileContents.subarray(24)
      await fs.promises.writeFile(file.tmpPath, fileContents)
    }


    //We check the magic signature(as integers) to see if the file is a zip
    if (fileContents[0] == 80 && fileContents[1] == 75 && fileContents[2] == 3) {
      const unzipPath = await unzipToDirectory(file.tmpPath, file.clientName)
      res = await this.skanderKit.filesToObj([
        `${unzipPath}/ai`,
        `${unzipPath}/gamestate`,
        `${unzipPath}/meta`,
      ])
    } else {
      //Normal file, we can parse it directly
      res = await this.skanderKit.fileToObj(file.tmpPath)
    }
    if (!res) return new SaveFileMalformedException()

    const processor = this.saveProcessorFactory.create(extension!, res) as EU4SaveProcessorService

    if (extension == 'eu4') {
      const { provinces, countries, metaData } = await processor.getAll()
      const em = this.databaseService.getEntityManager()
      const saveObj = new Save()
      saveObj.countriesData = countries
      saveObj.provincesData = provinces
      saveObj.game = GamesEnum.EU4
      saveObj.warsData = {}
      saveObj.metaData = metaData
      saveObj.uploader = await em.findOneOrFail(User, 1)
      saveObj.key = randomBytes(4).toString('hex')
      saveObj.alias = randomBytes(4).toString('hex')
      for (const dataset of metaData.datasets!) {
        let lookup
        dataset.steamId ? (lookup = { steamId: dataset.steamId }) : (lookup = { key: dataset.key })

        if (lookup) {
          const datasetObj = await em.findOne(Dataset, lookup)

          if (datasetObj) {
            saveObj.linkedDatasets.add(datasetObj)
          }
        }
      }

      await em.persistAndFlush(saveObj)
      return { key: saveObj.key }
    }
  }

  async getCountries({ params }: HttpContext) {
    const em = this.databaseService.getEntityManager()
    if (!params.id) return new BadFileException()

    const save = await em.findOne(Save, params.id, { fields: ['countriesData'] })
    if (!save) return new SaveFileDoesNotExistException()

    if (save?.countriesData) return save.countriesData

    return new SaveFileMalformedException()
  }
  async getSaveFileMetaData({ params }: HttpContext) {
    const em = this.databaseService.getEntityManager()
    if (!params.id) return new BadFileException()
    return await em.findOneOrFail(Save, params.id, { fields: ['metaData'] })
  }

  public async getSavefileDatafile({ params, response }: HttpContext) {
    const save = await this.databaseService.getSavefile(params.key)
    const handler = await this.datasetHandlerService.setSave(save)

    const data = await handler.load([params.datafile])

    response.header('content-type', 'application/json').send(data[params.datafile])
  }

  async getSavefileField({ params, response }: HttpContext) {
    const data = await this.databaseService.getSavefileField(params.key, params.field)

    response.header('content-type', 'application/json').send(data)
  }
  //
  // async getSavefileGame({ params, response }: HttpContext) {
  //   const data = await this.databaseService.getSavefileGame(params.key)
  //   response.header('content-type', 'application/json').send(data)
  // }
}
