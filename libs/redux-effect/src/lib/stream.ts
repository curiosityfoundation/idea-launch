import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import { Has, Tag, tag } from '@effect-ts/core/Has'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Middleware, Action, MiddlewareAPI, Dispatch, AnyAction } from 'redux'

interface ReduxStream<R, A extends Action, S> {
  _R: R
  _A: A
  _S: S
  (action: A, state: S): S.RIO<R, A>
}

export const reduxStream = <A extends Action, S>() =>
  <R>(fn: (action: A, state: S) => S.RIO<R, A>) =>
    fn as ReduxStream<R, A, S>

export type AnyReduxStream = ReduxStream<any, Action, any> | ReduxStream<never, Action, any>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type CombinedEnv<Ts extends NEA.NonEmptyArray<AnyReduxStream>> =
  UnionToIntersection<Ts[number]['_R']>

type CombinedActions<Ts extends NEA.NonEmptyArray<AnyReduxStream>> =
  Ts[number]['_A']

type CombinedState<Ts extends NEA.NonEmptyArray<AnyReduxStream>> =
  UnionToIntersection<Ts[number]['_S']>

export function combineStreams<
  Ss extends NEA.NonEmptyArray<AnyReduxStream>
>(
  streams: Ss
) {
  return reduxStream<
    CombinedActions<Ss>,
    CombinedState<Ss>
  >()<CombinedEnv<Ss>>(
    (action, state) => pipe(
      streams,
      NEA.map((s) => s(action, state)),
      S.fromIterable,
      S.flatten,
    )
  )
}
