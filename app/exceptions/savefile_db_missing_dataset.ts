import { Exception } from '@adonisjs/core/exceptions'

export default class SaveFileDbMalformedDatasets extends Exception {
  static status = 500
  static message =
    'The requested savefile exists in the database, but the datasets it is linked to are invalid or missing.'
}
