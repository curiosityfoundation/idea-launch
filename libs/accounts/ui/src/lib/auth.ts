import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

import { Authorized } from '@idea-launch/accounts/model'

export class AuthError {
  readonly tag: 'AuthError'
  constructor(readonly reason: string) { }
}

export interface Auth {
  logInWithGoogle: T.IO<AuthError, Authorized>
  logOut: T.UIO<void>
}

export const Auth = tag<Auth>()

export const { logInWithGoogle, logOut } = T.deriveLifted(Auth)(
  [] as never[],
  ['logInWithGoogle', 'logOut'],
  [] as never[],
)
