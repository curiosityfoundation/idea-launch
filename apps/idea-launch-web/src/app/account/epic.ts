import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'

import { logInWithGoogle, logOut } from '@idea-launch/accounts/ui'
import { AccountAction } from '@idea-launch/accounts/ui'
import { combineEpics, reduxEpic } from '@idea-launch/redux-effect'

const LogInWithGoogleEpic = reduxEpic<AccountAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(AccountAction.verified),
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

const LogOutGoogleEpic = reduxEpic<AccountAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(AccountAction.verified),
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
  LogOutGoogleEpic,
])
