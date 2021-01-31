import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'

import { accessBrowserWindowM } from '@idea-launch/browser-window'

import { RouteAction, encodeRoute } from '../../router'
import { reduxEffect } from '../constants'

export const RouterEffects = reduxEffect(
  (action) => pipe(
    action,
    O.fromPredicate(RouteAction.verified),
    O.fold(
      () => T.succeed([]),
      RouteAction.matchStrict({
        LocationChanged: () => T.succeed([]),
        LocationPushed: (a) => pipe(
          accessBrowserWindowM((browser) =>
            T.effectTotal(() => {
              browser.window.history.pushState(
                null,
                '',
                encodeRoute(a.payload)
              )
            })
          ),
          T.andThen(
            T.succeed([
              RouteAction.of.LocationChanged({
                payload: a.payload
              })
            ])
          ),
        )
      }),
    ),
  )
)
