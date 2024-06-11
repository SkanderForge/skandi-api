import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import SkanderKitService from '#services/skander_kit_service'
import NoFileException from '#exceptions/no_file_exception'

@inject()
export default class UtilitiesController {
  constructor(protected skanderKitService: SkanderKitService) {}

  /**
   * @show
   * @paramPath id - Describe the param
   * @description Returns a product with its relation on user and user relations
   * @responseBody 200 - <Product>.with(user, user.relations)
   * @responseBody 404
   */
  async clausewitzToJson(ctx: HttpContext) {
    const file = ctx.request.file('file')
    if (file?.tmpPath) {
      return this.skanderKitService.fileToJson(file.tmpPath)
    }
    throw new NoFileException()
  }

  async bmpToGeoJson(ctx: HttpContext) {
    const file = ctx.request.file('file')
    if (file?.tmpPath) {
      return this.skanderKitService.fileToGeoJson(file.tmpPath)
    }
    throw new NoFileException()
  }

}
