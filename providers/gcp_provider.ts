import type { ApplicationService } from '@adonisjs/core/types'
import logger from '@adonisjs/core/services/logger'
import GcpService from '#services/gcp_service'
import { Storage } from '@google-cloud/storage'

export default class SkanderKitProvider {
  constructor(protected app: ApplicationService) {}

  async start() {
    logger.info('Loading GCP Service')

    this.app.container
      .when(GcpService)
      .asksFor(Storage)
      .provide(() => new Storage({ keyFilename: 'gcs.json' }))
    logger.info('Initialized GCP Service')
  }
}
