import { EU4Country, EU4CountryData } from './gamedata/EU4Country.js'
import { EU4Province, EU4ProvinceData } from './gamedata/EU4Province.js'

export type CountriesData = EU4CountriesData
export type ProvincesData = EU4ProvincesData
export type WarsData = EU4CountriesData

export type Countries = EU4Countries
export type Provinces = EU4Provinces
export type Wars = EU4WarsData

export type MetaData = EU4MetaData

export type EU4CountriesData = {
  [key: string]: Partial<EU4CountryData>
}
export type EU4Countries = Record<string, Partial<EU4Country>>

export type EU4ProvincesData = {
  [key: number]: Partial<EU4ProvinceData>
}
export type EU4Provinces = Record<number, Partial<EU4Province>>

export type EU4WarsData = {
  [key: string]: EU4CountryData
}

export type EU4MetaData = Partial<{
  displayed_country_name: string
  player: string
  savegame_version: { first: string; second: string; third: string; fourth: string }
  dlc_enabled: string[]
  multi_player: string
  player_countries: string[]
  date: string
  mods_enabled_names: [{ filename: string; name: string }]
  datasets: SaveDataset[]
}>

export type SaveDataset = {
  steamId?: string
  key?: string
  gameVersion: string
}

export type EU4SaveData = {
  countries: EU4CountriesData
  provinces: EU4ProvincesData
  wars: WarsData
  metaData: EU4MetaData
} & EU4MetaData

export type EU4Save = {
  countries: EU4Countries
  provinces: EU4Provinces
  metaData: EU4MetaData
  wars: WarsData
} & EU4MetaData
