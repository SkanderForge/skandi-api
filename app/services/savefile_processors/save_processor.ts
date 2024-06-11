import { type DataFileSet, EU4Save } from '../../types/index.js'

export abstract class SaveProcessor {
  protected datasetData: DataFileSet

  getLoc(key: string) {
    if (!this.datasetData.localization) return 'meow'
    if (!this.datasetData.localization[key]) return '?'
    return this.datasetData.localization[key]
  }

  abstract getAll(): Promise<EU4Save>
}
