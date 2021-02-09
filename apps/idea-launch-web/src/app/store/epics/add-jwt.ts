import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'
import * as T from '@effect-ts/core/Effect'

import { AccountState } from '@idea-launch/accounts/ui'
import { reduxEpic } from '@idea-launch/redux-effect'

import { APIAction } from '../../api'
import { JWTAction, AppState } from '../constants'

export const AddJWTEpic =
  reduxEpic<JWTAction, AppState, APIAction>()(
    (actions, getState) =>
      pipe(
        actions,
        S.filter((a) => a.type === 'JWTRequested'),
        S.mapConcatM((a) =>
          pipe(
            getState,
            T.map((s) => s.account),
            T.map(
              AccountState.matchStrict({
                LoggedIn: (account) => [
                  {
                    type: a.payload.type,
                    payload: {
                      ...a.payload.payload,
                      jwt: account.idToken,
                    }
                  }
                ],
                LoggedOut: () => [],
                LoggingIn: () => [],
                LoggingOut: () => [],
              })
            )
          )
        )
      )
  )
