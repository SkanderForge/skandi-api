import { symbols } from '@adonisjs/auth'
import { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'
import { HttpContext } from '@adonisjs/core/http'
/**
 * The bridge between the User provider and the
 * Guard
 */
export type BasicGuardUser<RealUser> = {
  /**
   * Returns the unique ID of the user
   */
  getId(): string | number | bigint

  /**
   * Returns the original user object
   */
  getOriginal(): RealUser
}

/**
 * The interface for the UserProvider accepted by the
 * JWT guard.
 */
export interface BasicUserProviderContract<RealUser> {
  /**
   * A property the guard implementation can use to infer
   * the data type of the actual user (aka RealUser)
   */
  [symbols.PROVIDER_REAL_USER]: RealUser

  /**
   * Create a user object that acts as an adapter between
   * the guard and real user value.
   */
  createUserForGuard(user: RealUser): Promise<BasicGuardUser<RealUser>>

  /**
   * Find a user by their id.
   */
  findById(identifier: string | number | bigint): Promise<BasicGuardUser<RealUser> | null>
}
export class BasicAuth<UserProvider extends BasicUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  constructor(ctx: HttpContext) {
    console.log(ctx)
  }

  declare [symbols.GUARD_KNOWN_EVENTS]: NonNullable<unknown>
  driverName = 'basic' as const
  authenticationAttempted: boolean = false

  isAuthenticated: boolean = false

  user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    return true
  }

  async check(): Promise<boolean> {
    return true
  }

  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
    return true
  }

  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
    console.log(user)
    return {
      headers: {
        authorization: `Bearer meow`,
      },
    }
  }
}
