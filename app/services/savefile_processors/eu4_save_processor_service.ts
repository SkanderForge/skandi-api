import { inject } from '@adonisjs/core'
import type { DataFileSet, EU4MetaData, EU4Save } from '../../types/index.js'
import { EU4Country, EU4CountryData, EU4DetailedLosses } from '../../types/classes/EU4Country.js'
import { EU4Province } from '../../types/classes/EU4Province.js'
import DatasetHandlerService from '#services/dataset_handler_service'
import { SaveProcessor } from '#services/savefile_processors/save_processor'
import SaveFileDbMalformedDatasets from '#exceptions/savefile_db_missing_dataset'

@inject()
export default class EU4SaveProcessorService extends SaveProcessor {
  private saveData: EU4Save
  private metaData: EU4MetaData

  constructor(protected datasetHandlerService: DatasetHandlerService) {
    super()
  }
  setSave(saveData: EU4Save) {
    this.saveData = saveData
    this.metaData = this.getMetaData()
    return this
  }

  getFlag(tag: string) {
    if (!this.datasetData.flags) return 'eu4_vanilla_1.37/flags/REB.avif'
    if (this.datasetData.flags[tag]) return this.datasetData.flags[tag]
    return 'eu4_vanilla_1.37/flags/REB.avif'
  }

  async getAll(): Promise<EU4Save> {
    const handler = await this.datasetHandlerService.setDatasets(this.metaData.datasets!)
    this.datasetData = (await handler.load([
      'buildings',
      'localization',
      'tradeGoods',
      'flags',
      'tradeGoodsMap',
      'buildingsMap',
    ])) as DataFileSet

    return {
      countries: this.getCountries(),
      provinces: this.getProvinces(),
      metaData: this.metaData,
      wars: {},
    }
  }

  getMetaData() {
    const metaData: EU4MetaData = {
      player: this.saveData.player,
      displayed_country_name: this.saveData.displayed_country_name,
      player_countries: this.saveData.player_countries,
      multi_player: this.saveData.multi_player,
      date: this.saveData.date,
      dlc_enabled: this.saveData.dlc_enabled,
      mods_enabled_names: this.saveData.mods_enabled_names,
      savegame_version: this.saveData.savegame_version,
    }
    metaData.datasets = []
    for (const modObject of metaData.mods_enabled_names!) {
      if (modObject.filename.includes('ugc_')) {
        metaData.datasets.push({
          steamId: modObject.filename.split('ugc_')[1].split('.')[0],
          gameVersion: `${metaData.savegame_version!.first}.${metaData.savegame_version!.second}`,
        })
      }
    }
    metaData.datasets.push({
      key: `eu4_vanilla`,
      gameVersion: `${metaData.savegame_version!.first}.${metaData.savegame_version!.second}`,
    })

    return metaData
  }

  getLossesDetailed(input: number[]): EU4DetailedLosses {

    const res: EU4DetailedLosses = {
      infantry_battles: input[0] ?? 0,
      infantry_attrition: input[1] ?? 0,
      cavalry_battles: input[3] ?? 0,
      cavalry_attrition: input[4] ?? 0,
      artillery_battles: input[6] ?? 0,
      artillery_attrition: input[7] ?? 0,
    }
    res.total_attrition =
      res.artillery_attrition! + res.cavalry_attrition! + res.infantry_attrition!
    res.total_battles = res.artillery_battles! + res.cavalry_battles! + res.infantry_battles!
    res.total = res.total_attrition + res.total_battles
    return res
  }

  getCountries() {
    const countriesResult: { [key: string]: EU4Country } | undefined = {}
    for (const tag of Object.keys(this.saveData.countries)) {
      const countryData = this.saveData.countries[tag] as unknown as EU4CountryData

      if (!countryData.raw_development) continue

      const processed: EU4Country = {
        army_tradition: countryData.army_tradition,
        great_power_score: countryData.great_power_score,
        human: !!countryData.human,
        losses: this.getLossesDetailed(countryData.losses?.members as number[]),
        manpower: countryData.manpower,
        max_manpower: countryData.max_manpower,
        navy_tradition: countryData.navy_tradition,
        num_of_subunits: undefined,
        powers: undefined,
        primary_culture: countryData.primary_culture,
        technology: countryData.technology,
        treasury: countryData.treasury,
        was_human: !!countryData.was_player,
        tag: tag,
        monthly_income: countryData.estimated_monthly_income,
        total_development: countryData.raw_development,
        real_development: countryData.development,
        map_color: countryData.colors?.map_color as number[],
        idea_groups: countryData.active_idea_groups,
        country_name: this.getLoc(tag),
        flag: this.getFlag(tag),
        produced_goods_value_detailed: this.getLocalizedGoodsArray(
          countryData.produced_goods_value!
        ),
        traded_detailed: this.getLocalizedGoodsArray(countryData.traded!),
        num_of_goods_produced_detailed: this.getLocalizedGoodsArray(
          countryData.num_of_goods_produced!
        ),
      }
      countriesResult[tag] = processed
    }
    return countriesResult
  }

  getLocalizedGoodsArray(input: number[]) {
    if (!this.datasetData.tradeGoodsMap) throw new SaveFileDbMalformedDatasets()
    const tradeGoodsData = this.datasetData.tradeGoodsMap as string[]
    const output: Record<string, number> = {}
    for (const key in input) {
      output[tradeGoodsData[key]] = input[key]
    }
    return output
  }

  getProvinces() {
    const provincesResult: { [key: number]: EU4Province } | undefined = {}
    for (const provId of Object.keys(this.saveData.provinces)) {
      const id = parseInt(provId.split('-')[1])
      const provinceData = this.saveData.provinces[provId]
      if (!provinceData.base_tax) continue
      const processed: EU4Province = {
        id: id,
        name: provinceData.name,
        owner: provinceData.owner,
        controller: provinceData.controller,
        institutions: provinceData.institutions,
        religion: provinceData.religion,
        base_tax: provinceData.base_tax,
        trade_goods: provinceData.trade_goods,
        base_production: provinceData.base_production,
        base_manpower: provinceData.base_manpower,
        expand_infrastructure: provinceData.expand_infrastructure,
        country_improve_count: provinceData.country_improve_count,
      }
      provincesResult[id] = processed
    }
    return provincesResult
  }
}
