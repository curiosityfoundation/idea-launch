import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'

import { accessBrowserWindowM } from '@idea-launch/browser-window'
import { reduxEpic } from '@idea-launch/redux-effect'

import { RouteAction, encodeRoute } from './constants'

export const RouterEpic = reduxEpic<RouteAction, {}>()(
  (actions) => pipe(
    actions,
    S.map((a) => {
      console.log('LocationPushed', a);
      return a
    }),
    S.filter(RouteAction.is.LocationPushed),
    S.mapM((a) =>
      pipe(
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
          T.succeed(
            RouteAction.of.LocationChanged({
              payload: a.payload
            })
          )
        )
      )
    )
  )
)
