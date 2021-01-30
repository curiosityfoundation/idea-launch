import { ADTType, ofType, makeADT } from '@effect-ts/morphic/Adt'

import { State } from './constants'

interface LoggedIn {
  status: 'LoggedIn'
}

interface NoProfile {
  status: 'NoProfile'
}

interface LoggedOut {
  status: 'LoggedOut'
}

export const AccountStatus = makeADT('status')({
  LoggedIn: ofType<LoggedIn>(),
  NoProfile: ofType<NoProfile>(),
  LoggedOut: ofType<LoggedOut>(),
})

export type AccountStatus = ADTType<typeof AccountStatus>

export const makeAccountStatus = (s: State): AccountStatus => {
  if (s.account.state === 'LoggedIn') {
    if ((s.api.findProfile.state === 'Success'
      || s.api.findProfile.state === 'Both')
      && s.api.findProfile.response.tag === 'Success') {
      return AccountStatus.of.LoggedIn({})
    } else {
      return AccountStatus.of.NoProfile({})
    }
  } else {
    return AccountStatus.of.LoggedOut({})
  }
}
