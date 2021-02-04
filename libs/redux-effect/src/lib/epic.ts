import * as A from '@effect-ts/core/Array'
import * as C from '@effect-ts/core/Chunk'
import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Action } from 'redux'

import {
  ReduxEffectType,
  CombinedAction,
  CombinedEnv,
  CombinedState,
  CombinedOutAction
} from './util'

export interface ReduxEpic<R, A extends Action, S, O extends Action> extends ReduxEffectType<R, A, S, O> {
  (action: S.UIO<A>, getState: T.UIO<S>): S.RIO<R, O>
}

export const reduxEpic = <A extends Action, S, O extends Action = A>() =>
  <R>(fn: (action: S.UIO<A>, getState: T.UIO<S>) => S.RIO<R, O>) =>
    fn as ReduxEpic<R, A, S, O>

export type AnyReduxEpic = ReduxEpic<any, Action, any, Action>
  | ReduxEpic<never, Action, any, Action>

export function combineEpics<
  Epics extends NEA.NonEmptyArray<AnyReduxEpic>
>(
  epics: Epics
) {
  return reduxEpic<
    CombinedAction<Epics>,
    CombinedState<Epics>,
    CombinedOutAction<Epics>
  >()<CombinedEnv<Epics>>(
    (actions, getState) =>
      pipe(
        actions,
        S.broadcast(
          epics.length,
          Number.MAX_SAFE_INTEGER
        ),
        S.managed,
        S.chain((copies) =>
          pipe(
            copies,
            C.asArray,
            A.zip(epics),
            A.map(([copy, epic]) =>
              epic(copy, getState)
            ),
            S.fromIterable,
          )
        ),
        S.flattenParUnbounded,
      )
  )
}
