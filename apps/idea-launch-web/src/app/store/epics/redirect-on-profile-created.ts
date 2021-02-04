import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'

import { APIAction } from '../../api'
import { Route, RouteAction } from '../../router'

export const FindProfileOnLoginEpic =
  reduxEpic<APIAction, {}, RouteAction>()(
    (actions) =>
      pipe(
        actions,
        S.filter(APIAction.is.APIRequestSucceeded),
        S.filter((a) => a.payload.endpoint === 'CreateProfile'),
        S.map((a) =>
          RouteAction.of.LocationPushed({
            payload: Route.of.Welcome({})
          })
        )
      )
  )
