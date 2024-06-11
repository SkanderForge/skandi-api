import { inject } from '@adonisjs/core'
import { Save } from '#entities/save.entity'
import { DataFileSet, DataFileSetKeys, DataFileVal, SaveDataset } from '../types/index.js'
import { Dataset } from '#entities/dataset.entity'
import SaveFileDbMalformedDatasets from '#exceptions/savefile_db_missing_dataset'
import redis from '@adonisjs/redis/services/main'
import DatabaseService from '#services/database_service'

@inject()
export default class DatasetHandlerService {
  private save: Save
  private vanillaSet: Dataset
  private modSets: Dataset[]
  private linkedDatasetsIdSet: string

  constructor(protected databaseService: DatabaseService) {}

  /**
   * We use setter here because we'd rather the entire app revolved around dependency
   * injection wherever possible. Is there a better way?
   * @param save
   */
  async setSave(save: Save) {
    this.save = save
    await this.save.linkedDatasets.load()
    this.vanillaSet = this.save.linkedDatasets.find(
      (dataset) => dataset.isVanilla == true
    ) as Dataset
    if (!this.vanillaSet) throw new SaveFileDbMalformedDatasets()

    this.modSets = this.save.linkedDatasets.filter(
      (dataset) => dataset.isVanilla == false
    ) as Dataset[]

    /**
     * We generate a string based on the datasets present in the savefile that we actually have access to in the database.
     * We use this to cache datafile queries.
     * It doesn't matter too much that we use IDs for this, because this is meant for temporary caching only.
     */
    this.linkedDatasetsIdSet = this.modSets
      .reduce((accumulator, modSet) => accumulator + `${modSet.key}-`, `${this.vanillaSet.key}-`)
      .slice(0, -1)
    return this
  }

  async setDatasets(saveDatasets: SaveDataset[]) {
    const dbDatasets = []
    const em = this.databaseService.getEntityManager()
    for (const saveDataset of saveDatasets) {
      let lookup
      if (saveDataset.key) lookup = { key: saveDataset.key }
      if (saveDataset.steamId) lookup = { key: saveDataset.steamId }
      let dbDataset
      const [gameVersionOne, gameVersionSecond] = saveDataset.gameVersion.split('.')

      saveDataset.gameVersion = `${gameVersionOne}.${gameVersionSecond}`

      try {
        dbDataset = await em.findOne(Dataset, lookup!)
      } catch (err) {
        saveDataset.gameVersion = `${gameVersionOne}.${parseInt(gameVersionSecond) - 1}`
        dbDataset = await em.findOne(Dataset, lookup!)
      }

      if (dbDataset) dbDatasets.push(dbDataset)
    }

    this.vanillaSet = dbDatasets.find((dataset) => dataset.isVanilla == true) as Dataset
    if (!this.vanillaSet) throw new SaveFileDbMalformedDatasets()

    this.modSets = dbDatasets.filter((dataset) => dataset.isVanilla == false) as Dataset[]

    this.linkedDatasetsIdSet = this.modSets
      .reduce((accumulator, modSet) => accumulator + `${modSet.key}-`, `${this.vanillaSet.key}-`)
      .slice(0, -1)

    return this
  }

  /**
   * Loads datafiles from an array of datafile keys. Merges when necessary,
   * using vanilla files as base to be extended by mod files.
   * 1. Checks redis cache, outputs it if file already exists
   * 2. Loads vanilla file from the database
   * 3. Loads mod files, merges with the vanilla file
   */
  async load(dataKeys: DataFileSetKeys[]): Promise<{ [K in keyof DataFileSet]?: DataFileVal }> {
    const res: { [K in keyof DataFileSet]?: DataFileVal } = {}

    await Promise.all(
      dataKeys.map(async (dataKey) => {
        const redisKey = `d/${this.linkedDatasetsIdSet}/${dataKey}`

        const cached = await redis.get(redisKey)
        if (cached) {
          res[dataKey] = JSON.parse(cached) as DataFileVal
          return
        }

        const vanillaDataFiles = (
          await this.vanillaSet.datafiles.matching({ where: { key: dataKey } })
        ).pop()

        let dataFile = vanillaDataFiles?.data
        if (!dataFile) {
          res[dataKey] = {}
          return
        }

        for (const dataset of this.modSets) {
          const modDataFiles = (await dataset.datafiles.matching({ where: { key: dataKey } })).pop()
          const modData = modDataFiles?.data

          if (modData) {
            dataFile = { ...(dataFile as object), ...modData }
          }
        }
        res[dataKey] = dataFile as DataFileVal
        await redis.set(redisKey, JSON.stringify(dataFile))
      })
    )
    return res
  }
}
