import type { ApplicationService } from '@adonisjs/core/types'
import { MikroORM } from '@mikro-orm/postgresql'
// @ts-expect-error We're using JS here. Not a biggie
import config from '../mikro-orm.config.js'
import DatabaseService from '#services/database_service'
export default class MikroOrmProvider {
  constructor(protected app: ApplicationService) {}

  async ready() {
    const orm = await MikroORM.init(config)
    this.app.container
      .when(DatabaseService)
      .asksFor(MikroORM)
      .provide(() => orm)
  }
}
