import * as O from '@effect-ts/core/Option'

import { AccountState } from './state'

export const selectLoggedIn = AccountState.matchStrict({
  LoggedIn: (s) => O.some(s),
  LoggedOut: () => O.none,
  LoggingIn: () => O.none,
  LoggingOut: () => O.none,
})
