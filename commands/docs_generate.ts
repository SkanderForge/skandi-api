import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import fs from "node:fs";
export default class DocsGenerate extends BaseCommand {
  static commandName = 'docs:generate'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  async run() {
    const Router = await this.app.container.make('router')
    Router.commit()

    await fs.promises.writeFile('docs.json', JSON.stringify(Router, null, 2))

    // console.log(await AutoSwagger.default.json(Router.toJSON(),swagger))
    //
  //  await AutoSwagger.default.writeFile(Router.toJSON(), swagger)
  }
}
