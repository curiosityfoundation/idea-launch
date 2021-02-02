import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Action } from 'redux'

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
