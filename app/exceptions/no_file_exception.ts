import { Exception } from '@adonisjs/core/exceptions'

export default class NoFileException extends Exception {
  static status = 400
  static message = 'Required file was not attached or the file was not valid.'
}
