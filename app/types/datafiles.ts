import { FeatureCollection } from 'geojson'
import { GenericDataFile } from './index.js'

export type Localization = { [key: string]: string }
export type EU4Flags = Record<string, string>
export type Modifiers = { [key: string]: object }

export type DataFileVal = Partial<DataFileSet[keyof DataFileSet]>

export type DataFileList = {
  localization: Localization
  flags: EU4Flags
  modifiers: GenericDataFile
  mapData: FeatureCollection
  governmentReforms: GenericDataFile
  greatProjects: GenericDataFile
  spendingKeys: {
    economy: string[]
    mana: string[]
  }
  estates: GenericDataFile
  estatePrivileges: GenericDataFile
  buildings: GenericDataFile
  ideas: GenericDataFile
  technologies: GenericDataFile
  tradeNodes: GenericDataFile
  policies: GenericDataFile
  tradeGoods: GenericDataFile
  religions: GenericDataFile
}

export type DataFileSet = Partial<
  DataFileList & { [Property in keyof DataFileList as `${Property}Map`]: string[] }
>

export type DataFileSetKeys = keyof DataFileSet
