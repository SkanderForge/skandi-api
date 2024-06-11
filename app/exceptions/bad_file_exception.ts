import { Exception } from '@adonisjs/core/exceptions'

export default class BadFileException extends Exception {
  static status = 400
  static message =
    'The attached file was malformed, otherwise incorrect or its processing failed for an unrelated reason.'
}
