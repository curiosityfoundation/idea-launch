import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { AccountAction } from '@idea-launch/accounts/ui'
import { reduxEpic } from '@idea-launch/redux-effect'

import { APIAction } from '../../api'

export const FindProfileOnLoginEpic =
  reduxEpic<AccountAction, {}, APIAction>()(
    (actions) =>
      pipe(
        actions,
        S.filter(AccountAction.is.LoginSuccess),
        S.map((a) =>
          APIAction.of.APIRequested({
            payload: {
              endpoint: 'FindProfile',
              body: {},
              jwt: a.payload.idToken,
            }
          })
        )
      )
  )
