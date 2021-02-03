import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import { Has, Tag, tag } from '@effect-ts/core/Has'
import { Middleware } from 'redux'

import { AnyReduxEffect } from './effect'
import { AnyReduxEpic } from './epic'
import { ReduxQueue } from './queue'

export interface ReduxEffectMiddleware {
  middleware: Middleware
  runEffects: T.Effect<any, any, never>
}

export const ReduxEffectMiddleware = tag<ReduxEffectMiddleware>()

export function makeReduxEffectMiddleware<
  ReduxEffect extends AnyReduxEffect
>(
  effect: ReduxEffect
): <T extends Tag<ReduxQueue<ReduxEffect['_A'], ReduxEffect['_S']>>>(tag: T) =>
    T.RIO<
      Has<ReduxQueue<ReduxEffect['_A'], ReduxEffect['_S']>> & ReduxEffect['_R'],
      ReduxEffectMiddleware
    > {
  return (tag) => T.accessService(tag)(
    (env) => ({
      middleware: (api) => (next) => (action) =>
        T.run(
          pipe(
            env.actions.offer(action),
            T.andThen(Ref.set(api)(env.middlewareApi)),
          ),
          () => next(action)
        ),
      runEffects: pipe(
        env.actions.take,
        T.chain((action) =>
          pipe(
            effect(
              action,
              pipe(
                Ref.get(env.middlewareApi),
                T.map((api) => api.getState())
              ),
            ),
            T.chain((actions) =>
              pipe(
                env.middlewareApi,
                Ref.get,
                T.chain((api) =>
                  T.effectTotal(() => {
                    actions.forEach((a) => api.dispatch(a))
                  })
                )
              )
            ),
            T.catchAllDefect((defect) =>
              T.effectTotal(() => {
                if (typeof console === 'object'
                  && typeof console.warn === 'function'
                  && process.env.NODE_ENV !== 'production') {
                  console.warn('a defect occured in a redux effect:\n', defect);
                }
              })
            ),
            T.provide(env),
            T.fork,
            T.asUnit,
          )
        ),
        T.provide(env),
        T.forever,
      ),
    })
  )

}

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
        T.provide(env),
        T.forever,
      ),
    })
  )

}
