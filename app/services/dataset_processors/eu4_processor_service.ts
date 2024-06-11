import { inject } from '@adonisjs/core'
import fs from 'node:fs'
import SkanderKitService from '#services/skander_kit_service'
import GcpService from '#services/gcp_service'
// @ts-expect-error There's nothing for this.
import TGA from 'tga'

import sharp from 'sharp'
import { getFilesFromDirectory, readFilename } from '../../utilities/fileutils.js'
import { rgbToHex } from '../../utilities/colors.js'
import { DataFileSetKeys, DataFileVal, GenericDataFile, Localization } from '../../types/index.js'
import { Feature, FeatureCollection } from 'geojson'
import { Datafile } from '#entities/datafile.entity'
import SaveFileDbMalformedDatasets from "#exceptions/savefile_db_missing_dataset";

@inject()
export default class EU4DatasetProcessorService {
  private dataSrc: string
  private dataKey: string
  protected gameVersion: string
  constructor(
    protected skanderKit: SkanderKitService,
    protected gcpService: GcpService
  ) {}
  public setDataSrc(dataSrc: string): EU4DatasetProcessorService {
    this.dataSrc = dataSrc
    return this
  }
  public setInput(input: {
    gameVersion: string
    alias: string
    key: string
    game: string
  }): EU4DatasetProcessorService {
    this.gameVersion = input.gameVersion
    this.dataKey = input.key
    return this
  }

  public async process(): Promise<Datafile[]> {
    const returnedDatafiles: Record<string,Datafile> = {}

    const getters: [DataFileSetKeys, () => Promise<DataFileVal | false>, boolean][] = [
      ['mapData', () => this.getMapGeojson(), true],
      ['localization', () => this.getLocalization(), false],
      ['flags', () => this.getFlags(), false],
      ['ideas', () => this.getGenericData('common/ideas'), false],
      ['governmentReforms', () => this.getGenericData('common/government_reforms'), false],
      ['greatProjects', () => this.getGenericData('common/great_projects'), false],
      ['estates', () => this.getGenericData('common/estates'), false],
      ['estatePrivileges', () => this.getGenericData('common/estate_privileges'), false],
     ['buildings', () => this.getGenericData('common/buildings'), false],
      ['technologies', () => this.getGenericData('common/technologies'), false],
     ['tradeNodes', () => this.getGenericData('common/tradenodes'), false],
      ['tradeGoods', () => this.getGenericData('common/tradegoods'), false],
      ['policies', () => this.getGenericData('common/policies'), false],
      ['modifiers', () => this.getModifiers(), false],
      ['religions', () => this.getGenericData('common/religions'), false],
    ]



    await Promise.all(
      getters.map(async ([dataKey, dataGetter, unique]) => {
        const data = await dataGetter()
        if (data) returnedDatafiles[dataKey] = new Datafile(dataKey, data, unique)
      })
    )
    if(!returnedDatafiles) throw new SaveFileDbMalformedDatasets()

    Array.from(['tradeGoods','buildings']).map((key)=>{
      const data = Object.keys(returnedDatafiles[key].data!)
      const output = []
      console.log(data)
      for(let i = 0; i < data.length; i++){
        output.push(data[i])
      }
      returnedDatafiles[`${key}Map`] = new Datafile(`${key}Map`,output,true);
    })
    console.log('meo1w',Object.keys(returnedDatafiles))

    return Object.values(returnedDatafiles)
  }


  async getGenericData(folder: string): Promise<GenericDataFile | false> {
    if (!fs.existsSync(`${this.dataSrc}/${folder}`)) return false
    const files = await getFilesFromDirectory(`${this.dataSrc}/${folder}`, true)
    console.log(files)
    return await this.skanderKit.filesToObj(files)
  }

  public async getModifiers(): Promise<object | false> {
    const promises = [
      `${this.dataSrc}/common/event_modifiers`,
      `${this.dataSrc}/common/triggered_modifiers`,
      `${this.dataSrc}/common/province_triggered_modifiers`,
      `${this.dataSrc}/common/static_modifiers`,
    ].map(async (src) => await getFilesFromDirectory(src, true))

    const results = await Promise.all(promises)
    const files = results.flat()
    let res: never[] = []
    for (const file of files) {
      res = { ...res, ...(await this.skanderKit.fileToObj(file)) }
    }
    return res
  }

  public async getLocalization(): Promise<Localization | false> {
    if (!fs.existsSync(`${this.dataSrc}/localisation`)) return false
    const files = await getFilesFromDirectory(`${this.dataSrc}/localisation`, true)
    const lang: { [key: string]: string } = {}
    for (const file of files) {
      if (!file.includes('_english')) continue
      for (const line of fs.readFileSync(file).toString().split('\n')) {
        if (!line.includes(':') || !line.includes('"')) continue
        const [keyPart, valuePart] = line.split(':')

        // const key = keyPart.split(':')[0].trim()
        // const value = valuePart.split('"')[1].split('"')[0].trim()

        //TODO localization splitting into smaller parts

        lang[keyPart.split(':')[0].trim()] = valuePart.split('"')[1].split('"')[0].trim()
      }
    }
    return lang
  }

  private async getFlags(): Promise<{ [p: string]: string } | false> {
    if (!fs.existsSync(`${this.dataSrc}/gfx/flags`)) return false

    const res: Record<string,string> = {}
    /**
     * We do this with promises to avoid the loop getting clogged up
     * in sequential processing. This is not the prettiest, but it decreases
     * the processing time by an order of magnitude.
     */
    const promises = fs
      .readdirSync(`${this.dataSrc}/gfx/flags`)
      .filter((file) => readFilename(file).extension === 'tga')
      .map(async (file) => {
        const fullPath = `${this.dataSrc}/gfx/flags/${file}`
        const tgaData = new TGA(fs.readFileSync(fullPath))
        const imageData = sharp(tgaData.pixels, {
          raw: { width: tgaData.width, height: tgaData.height, channels: 4 },
        })
        const buff = await imageData.avif().toBuffer()

        const fileName = readFilename(file)
        await fs.promises.writeFile(`${this.dataSrc}/gfx/flags/${fileName.name}.avif`, buff)

        await this.gcpService.uploadPublicFile(
          `${this.dataSrc}/gfx/flags/${fileName.name}.avif`,
          `${this.dataKey}/flags/${fileName.name}.avif`
        )
        res[fileName.name] = `${this.dataKey}/flags/${fileName.name}.avif`
        return fileName.name
      })
    await Promise.all(promises)
    if(res) return res
    return false
  }
  private async getMapMetadata(): Promise<
    { sea_starts: number[]; width: number; height: number } | false
  > {
    if (!fs.existsSync(`${this.dataSrc}/map/default.map`)) return false
    return await this.skanderKit.fileToObj(`${this.dataSrc}/map/default.map`)
  }
  private async getMapDefinitions(): Promise<string[] | false> {
    if (!fs.existsSync(`${this.dataSrc}/map/definition.csv`)) return false

    const fileData = await fs.promises.readFile(`${this.dataSrc}/map/definition.csv`, 'utf8')
    const res: string[] | [] = []
    for (const line of fileData.split('\n')) {
      const [province, red, green, blue] = line.split(';')
      if (province == 'province') continue
      res[parseInt(province)] = rgbToHex(red, green, blue)
    }
    return res
  }

  private async getMapGeojson(): Promise<FeatureCollection | false> {
    if (!fs.existsSync(`${this.dataSrc}/map/provinces.bmp`)) return false

    const metadata = await this.getMapMetadata()
    const definitions = await this.getMapDefinitions()
    if (!definitions || !metadata) return false

    const provincesFile = await fs.promises.readFile(`${process.cwd()}/temp/eu4_map.json`)
    const provincesData = JSON.parse(provincesFile.toString('utf8')) as FeatureCollection & {
      properties: GenericDataFile
    }
    provincesData.properties = metadata
    provincesData.features = provincesData.features.map((feature: Feature) => {
      const id = definitions.findIndex((a) => a == feature.properties!.hex)
      const isSeazone = metadata['sea_starts'].includes(id)

      return {
        ...feature,
        properties: {
          id: id,
          isSeazone: isSeazone,
        },
      }
    })
    return provincesData
  }
}
