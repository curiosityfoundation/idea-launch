import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';

import { logInWithGoogle } from '@idea-launch/accounts/ui'

import { epic, Action } from '../constants';

export const LoginEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.LoginStarted),
    S.mapM((a) =>
      pipe(
        logInWithGoogle,
        T.map((payload) =>
        Action.of.LoginSuccess({
            payload
          })
        ),
        T.catchAll((err) =>
          T.succeed(
            Action.of.LoginFailure({
              payload: err.reason
            })
          )
        )
      )
    )
  )
)
