import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'

import { APIAction } from '../../api'
import { RouteAction } from '../../router'
import { JWTAction } from '../constants'

export const FindProjectsOnEnterFeed =
  reduxEpic<RouteAction, {}, JWTAction>()(
    (actions) =>
      pipe(
        actions,
        S.filter(RouteAction.is.LocationChanged),
        S.filter((a) => a.payload.type === 'Feed'),
        S.map(() =>
          JWTAction.of.JWTRequested({
            payload: APIAction.of.APIRequested({
              payload: {
                endpoint: 'ListProjects',
                body: {
                  page: 1,
                },
              }
            })
          })
        )
      )
  )
