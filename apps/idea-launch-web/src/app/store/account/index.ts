import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'

import { logInWithGoogle, logOut } from '@idea-launch/accounts/ui'
import { AccountAction } from '@idea-launch/accounts/ui'

import { reduxEffect, Action } from '../constants'

export const AccountEffects = reduxEffect(
  (a) => pipe(
    a,
    O.fromPredicate(AccountAction.verified),
    O.fold(
      () => T.succeed([]),
      AccountAction.matchStrict({
        LoginStarted: () => pipe(
          logInWithGoogle,
          T.map(() => []),
          T.catchAll((err) =>
            T.succeed([
              Action.of.LoginFailure({
                payload: err.reason
              })
            ])
          )
        ),
        LoginFailure: () => T.succeed([]),
        LoginSuccess: () => T.succeed([
          Action.of.APIRequested({
            payload: {
              endpoint: 'FindProfile',
              body: {}
            }
          })
        ]),
        LogoutStarted: () => pipe(
          logOut,
          T.map(() => [])
        ),
        LogoutSuccess: () => T.succeed([]),
      }),
    )
  )
)
