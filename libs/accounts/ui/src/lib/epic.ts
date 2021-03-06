import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'

import { combineEpics, reduxEpic } from '@idea-launch/redux-effect'

import { logInWithGoogle, logOut } from './auth'
import { AccountAction } from './state'

const LogInWithGoogleEpic = reduxEpic<AccountAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(AccountAction.is.LoginStarted),
    S.mapConcatM(() =>
      pipe(
        logInWithGoogle,
        T.map(() => []),
        T.catchAll((err) => 
          T.succeed([
            AccountAction.of.LoginFailure({
              payload: err.reason
            })
          ])
        )
      )
    )
  )
)

const LogOutEpic = reduxEpic<AccountAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(AccountAction.is.LogoutStarted),
    S.mapConcatM(() =>
      pipe(
        logOut,
        T.map(() => []),
      )
    )
  )
)

export const AccountEpic = combineEpics([
  LogInWithGoogleEpic,
  LogOutEpic,
])
