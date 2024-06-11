import { defineConfig } from '@adonisjs/auth'
import { InferAuthEvents, Authenticators, InferAuthenticators } from '@adonisjs/auth/types'
import { BasicAuth } from '#guards/basic_auth'

const authConfig: unknown = defineConfig({
  default: 'meow',
  guards: {
    meow: (ctx) => {
      return new BasicAuth(ctx)
    },
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  // @ts-expect-error asd
  interface Authenticators extends InferAuthenticators<unknown> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
