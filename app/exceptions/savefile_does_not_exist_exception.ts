import { Exception } from '@adonisjs/core/exceptions'

export default class SaveFileDoesNotExistException extends Exception {
  static status = 404
  static message = 'The requested savefile does not exist in the database..'
}
