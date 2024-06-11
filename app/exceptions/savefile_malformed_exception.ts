import { Exception } from '@adonisjs/core/exceptions'

export default class SaveFileMalformedException extends Exception {
  static status = 500
  static message =
    'The requested savefile exists in the database, but seems to be malformed. Try reprocessing the file through your profile.'
}
