import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import { Has, Tag, tag } from '@effect-ts/core/Has'
import { Middleware } from 'redux'

import { AnyReduxEffect } from './effect'
import { AnyReduxStream } from './stream'
import { ReduxQueue } from './queue'

export interface ReduxEffectMiddleware {
  middleware: Middleware
  runEffects: T.Effect<unknown, never, any>
}

export const ReduxEffectMiddleware = tag<ReduxEffectMiddleware>()

export function makeReduxEffectMiddleware<
  Ts extends AnyReduxEffect
>(
  effect: Ts
):
  <T extends Tag<ReduxQueue<Ts['_A'], Ts['_S']>>>(tag: T) =>
    T.RIO<
      Has<ReduxQueue<Ts['_A'], Ts['_S']>> & Ts['_R'],
      ReduxEffectMiddleware
    > {
  return (tag) => T.accessService(tag)(
    (env) => ({
      middleware: (api) => (next) => (action) =>
        T.run(
          pipe(
            env.actionsWithState.offer({
              action,
              state: api.getState(),
            }),
            T.andThen(Ref.set(api)(env.middlewareApi)),
          ),
          () => next(action)
        ),
      runEffects: pipe(
        env.actionsWithState.take,
        T.chain(({ action, state }) =>
          pipe(
            effect(action, state),
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
            T.fork
          )
        ),
        T.forever,
      ),
    })
  )

}

export function makeReduxStreamMiddleware<
  Ss extends AnyReduxStream
>(
  stream: Ss
):
  <T extends Tag<ReduxQueue<Ss['_A'], Ss['_S']>>>(tag: T) =>
    T.RIO<
      Has<ReduxQueue<Ss['_A'], Ss['_S']>> & Ss['_R'],
      ReduxEffectMiddleware
    > {
  return (tag) => T.accessService(tag)(
    (env) => ({
      middleware: (api) => (next) => (action) =>
        T.run(
          pipe(
            env.actionsWithState.offer({
              action,
              state: api.getState(),
            }),
            T.andThen(Ref.set(api)(env.middlewareApi)),
          ),
          () => next(action)
        ),
      runEffects: pipe(
        env.actionsWithState,
        S.fromQueue,
        S.chain(({ action, state }) =>
          stream(action, state)
        ),
        S.mapM((a) =>
          pipe(
            env.middlewareApi,
            Ref.get,
            T.chain((api) =>
              T.effectTotal(() => {
                api.dispatch(a)
              })
            )
          )
        ),
        S.runDrain,
        T.asUnit,
      ),
    })
  )

}
