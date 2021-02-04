import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import * as A from '@effect-ts/core/Array'
import * as Ma from '@effect-ts/core/Effect/Managed'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe, flow } from '@effect-ts/core/Function'
import { Has, Tag, tag } from '@effect-ts/core/Has'
import { Middleware } from 'redux'

import { AnyReduxEpic } from './epic'
import { ReduxQueue } from './queue'

export interface ReduxEffectMiddleware {
  middleware: Middleware
  runEffects: T.Effect<any, any, any>
}

export const ReduxEffectMiddleware = tag<ReduxEffectMiddleware>()

export function makeReduxEpicMiddleware<
  ReduxEffectEpic extends AnyReduxEpic
>(
  epic: ReduxEffectEpic
): <T extends Tag<ReduxQueue<ReduxEffectEpic['_A'], ReduxEffectEpic['_S']>>>(tag: T) =>
    T.RIO<
      Has<ReduxQueue<ReduxEffectEpic['_A'], ReduxEffectEpic['_S']>> & ReduxEffectEpic['_R'],
      ReduxEffectMiddleware
    > {
  return (tag) => T.accessService(tag)(
    (env) => ({
      middleware: (api) => (next) => (action) =>
        T.run(
          pipe(
            env.actions.offer(action),
            T.andThen(
              Ref.set(api)(env.middlewareApi)
            ),
          ),
          () => next(action)
        ),
      runEffects: pipe(
        epic(
          pipe(
            env.actions,
            S.fromQueue,
          ),
          pipe(
            Ref.get(env.middlewareApi),
            T.map((api) => api.getState())
          ),
        ),
        S.mapM((a) =>
          pipe(
            Ref.get(env.middlewareApi),
            T.chain((api) =>
              T.effectTotal(() => {
                api.dispatch(a)
              })
            )
          )
        ),
        S.runDrain,
        T.catchAllDefect((e) =>
          T.effectTotal(() => {
            console.log(e);
          })
        ),
        T.provide(env),
      ),
    })
  )

}
