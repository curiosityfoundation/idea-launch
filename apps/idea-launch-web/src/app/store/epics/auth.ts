import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'

import { logInWithGoogle, logOut } from '@idea-launch/accounts/ui'

import { epic, Action } from '../constants'

export const LoginEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.LoginStarted),
    S.mapConcatM(() =>
      pipe(
        logInWithGoogle,
        T.map(() => []),
        T.catchAll((err) =>
          T.succeed([
            Action.of.LoginFailure({
              payload: err.reason
            })
          ])
        )
      )
    )
  )
)

export const LogoutEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.LogoutStarted),
    S.mapConcatM(() =>
      pipe(
        logOut,
        T.map(() => [])
      )
    )
  )
)
