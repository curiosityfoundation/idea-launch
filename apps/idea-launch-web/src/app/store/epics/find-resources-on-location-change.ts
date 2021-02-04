import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { reduxEpic } from '@idea-launch/redux-effect'

import { APIAction } from '../../api'
import { RouteAction } from '../../router'
import { AppState } from '../constants'

export const FindResourcesOnLocationChange =
  reduxEpic<RouteAction, AppState, APIAction>()(
    (actions, getState) =>
      pipe(
        actions,
        S.filter(RouteAction.is.LocationChanged),
        S.mapM(() => getState),
        S.mapConcat((s) =>
          s.api.listResources.state === 'Init'
            ? [
              APIAction.of.APIRequested({
                payload: {
                  endpoint: 'ListResources',
                  body: {},
                }
              })
            ]
            : []
        )
      )
  )
