import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { getTypeScriptReader, getOpenApiWriter, makeConverter } from 'typeconv'
import {getFilesFromDirectory} from "../app/utilities/fileutils.js";

export default class GenerateDocumentation extends BaseCommand {
  static commandName = 'generate:documentation'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    const reader = getTypeScriptReader()
    const writer = getOpenApiWriter({ format: 'yaml', title: 'My API', version: 'v1' })
    const { convert } = makeConverter(reader, writer)

    const files = await getFilesFromDirectory(`./app/types`,true,true)
    console.log(files)

  }
}
