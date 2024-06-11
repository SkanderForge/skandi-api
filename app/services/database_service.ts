import { inject } from '@adonisjs/core'
import { Field, MikroORM } from '@mikro-orm/postgresql'
import { Dataset } from '#entities/dataset.entity'
import SaveFileDoesNotExistException from '#exceptions/savefile_does_not_exist_exception'
import { Save } from '#entities/save.entity'
import redis from '@adonisjs/redis/services/main'

@inject()
export default class DatabaseService {
  constructor(protected orm: MikroORM) {}

  getEntityManager() {
    return this.orm.em.fork()
  }

  async getDatafile(datasetKey: string, datafileKey: string) {
    const em = this.orm.em.fork()
    const data = await em.findOneOrFail(
      Dataset,
      { key: datasetKey },
      { populate: ['datafiles:ref'] }
    )
    const dataObj = await data.datafiles.matching({ where: { key: datafileKey } })

    return dataObj.pop()!.data
  }

  async getSavefile(savefileKey: string) {
    const em = this.orm.em.fork()
    try {
      return await em.findOneOrFail(
        Save,
        { $or: [{ key: savefileKey }, { alias: savefileKey }] },
        { populate: ['linkedDatasets:ref'] }
      )
    } catch (err) {
      throw new SaveFileDoesNotExistException()
    }
  }

  async getSavefileField(savefileKey: string, field: Field<Save>) {
    const em = this.orm.em.fork()
    if (await redis.exists(`${savefileKey}/${field}`)) {
      return redis.get(`${savefileKey}/${field}`)
    }

    const qb = em.createQueryBuilder(Save)
    qb.where({ $or: [{ key: savefileKey }, { alias: savefileKey }] })
    //If we are selecting single fields, we use execute() since we can't get result back as an entity.
    qb.addSelect(field)
    const res = await qb.execute()
    if (res) {
      redis.set(`${savefileKey}/${field}`, JSON.stringify(res[0][field as string]))
      return res[0][field as string]
    }
    return new SaveFileDoesNotExistException()
  }

  // async getSavefileGame(savefileKey: string) {
  //   if (await redis.exists(`${savefileKey}/game`)) {
  //     return redis.get(`${savefileKey}/game`)
  //   }
  //   const em = this.orm.em.fork()
  //   const qb = em.createQueryBuilder(Save)
  //   qb.where({ $or: [{ key: savefileKey }, { alias: savefileKey }] })
  //   qb.addSelect('game')
  //   const res = await qb.execute()
  //   if (res) {
  //     redis.set(`${savefileKey}/game`, JSON.stringify(res[0]['game']))
  //     return res[0]['game']
  //   }
  //   return new SaveFileDoesNotExistException()
  // }
}
