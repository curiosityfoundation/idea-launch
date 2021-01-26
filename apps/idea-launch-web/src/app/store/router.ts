import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';

import { epic, Action } from '../constants';
import { encodeRoute, accessBrowserWindowM } from '../router';

export const PushLocationEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.PushLocation),
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
            Action.of.LocationChanged({
              payload: a.payload
            })
          )
        )
      )
    ),
  )
)
