import type { ApplicationService } from '@adonisjs/core/types'
// @ts-expect-error WASM. We don't have types for it and can't get it yet.
import c2pwasm from '#providers/c2p_wasm'
// @ts-expect-error WASM. We don't have types for it and can't get it yet.
import b2vwasm from '#providers/b2v_wasm'

import logger from '@adonisjs/core/services/logger'
export default class SkanderKitProvider {
  constructor(protected app: ApplicationService) {}

  async start() {
    logger.info('Loading SkanderKit')
    const c2pInstance = await c2pwasm()
    this.app.config.set('c2p-service', c2pInstance)
    const b2vInstance = await b2vwasm()
    this.app.config.set('b2v-service', b2vInstance)

    logger.info('Initialized SkanderKit')
  }
}
