import * as T from '@effect-ts/core/Effect'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as A from '@effect-ts/core/Array'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Has, Tag, tag } from '@effect-ts/core/Has'
import { Middleware, Action, MiddlewareAPI, Dispatch, AnyAction } from 'redux'

export interface ActionWithState<A extends Action, S> {
  action: A
  state: S
}

export interface ReduxQueue<A extends Action, S> {
  middlewareApi: Ref.Ref<MiddlewareAPI<Dispatch<AnyAction>, S>>
  actionsWithState: Q.Queue<ActionWithState<A, S>>
}

export const ReduxQueueOf = <A extends Action, S>() => tag<ReduxQueue<A, S>>()

interface ReduxEffect<R, A extends Action, S> {
  _R: R
  _A: A
  _S: S
  (action: A, state: S): T.RIO<R, A.Array<A>>
}

export const reduxEffect = <A extends Action, S>() =>
  <R>(fn: (action: A, state: S) => T.RIO<R, A.Array<A>>) =>
    fn as ReduxEffect<R, A, S>

export type AnyReduxEffect = ReduxEffect<any, Action, any> | ReduxEffect<never, Action, any>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type CombinedEnv<Ts extends NEA.NonEmptyArray<AnyReduxEffect>> =
  UnionToIntersection<Ts[number]['_R']>

type CombinedActions<Ts extends NEA.NonEmptyArray<AnyReduxEffect>> =
  Ts[number]['_A']

type CombinedState<Ts extends NEA.NonEmptyArray<AnyReduxEffect>> =
  UnionToIntersection<Ts[number]['_S']>

export interface ReduxEffectMiddleware {
  middleware: Middleware
  runEffects: T.Effect<any, never, never>
}

export const ReduxEffectMiddleware = tag<ReduxEffectMiddleware>()

export function combineEffects<
  Ts extends NEA.NonEmptyArray<AnyReduxEffect>
>(
  effects: Ts
) {
  return reduxEffect<
    CombinedActions<Ts>,
    CombinedState<Ts>
  >()<CombinedEnv<Ts>>(
    (action, state) => pipe(
      effects,
      NEA.map((e) => e(action, state)),
      T.collectAllPar,
      T.map(A.flatten)
    )
  )
}

export function makeReduxEffectMiddleware<
  Ts extends AnyReduxEffect
>(
  effects: Ts
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
            effects(action, state),
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
