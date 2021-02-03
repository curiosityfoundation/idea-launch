import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'

import { AppAction } from '../constants'

export const FindProfileOnLoginEpic = reduxEpic<AppAction, {}>()(
  (actions) =>
    pipe(
      actions,
      S.map((a) => {
        console.log('FindProfileOnLoginEpic', a);
        return a
      }),
      S.filter(AppAction.is.LoginSuccess),
      S.map((a) =>
        AppAction.of.APIRequested({
          payload: {
            endpoint: 'FindProfile',
            body: {},
            jwt: a.payload.idToken,
          }
        })
      )
    )
)
