import * as T from '@effect-ts/core/Effect'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as A from '@effect-ts/core/Array'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Has, HasURI, Tag, tag } from '@effect-ts/core/Has'
import { Middleware, Action, MiddlewareAPI, Dispatch, AnyAction } from 'redux'

export interface ActionWithState<A extends Action, S> {
  action: A
  state: S
}

export interface ActionQueue<A extends Action, S> {
  middlewareApi: Ref.Ref<MiddlewareAPI<Dispatch<AnyAction>, S>>
  actionsWithState: Q.Queue<ActionWithState<A, S>>
}

export const ActionQueue = <A extends Action, S>() => tag<ActionQueue<A, S>>()

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

type CombinedEnv<Epics extends NEA.NonEmptyArray<AnyReduxEffect>> =
  UnionToIntersection<Epics[number]['_R']>

type CombinedActions<Epics extends NEA.NonEmptyArray<AnyReduxEffect>> =
  Epics[number]['_A']

type CombinedState<Epics extends NEA.NonEmptyArray<AnyReduxEffect>> =
  UnionToIntersection<Epics[number]['_S']>

interface ReduxEffectMiddleware {
  middleware: Middleware
  runEffects: T.Effect<any, never, never>
}

// export function combineEffects<
//   Fx extends NEA.NonEmptyArray<AnyReduxEffect>
// >(
//   fx: Fx
// ) {
//   return reduxEffect<
//     CombinedActions<Fx>,
//     CombinedState<Fx>
//   >()<CombinedEnv<Fx>>(
//     (action, state) => pipe(
//       fx,
//       NEA.map((e) => e(action, state)),
//       T.collectAllPar,
//       T.map((as) => A.flatten(as))
//     )
//   )
// }

export function makeReduxEffectMiddleware<
  Fx extends AnyReduxEffect
>(
  fx: Fx
):
  <T extends Tag<ActionQueue<Fx['_A'], Fx['_S']>>>(tag: T) =>
    T.RIO<
      Has<ActionQueue<Fx['_A'], Fx['_S']>> & Fx['_R'],
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
            fx(action, state),
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
            T.provide(env),
            T.fork
          )
        ),
        T.forever,
      ),
    })
  )

}
