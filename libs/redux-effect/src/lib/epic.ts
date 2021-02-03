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
  CombinedState
} from './util'

export interface ReduxEpic<R, A extends Action, S> extends ReduxEffectType<R, A, S> {
  (action: S.UIO<A>, getState: T.UIO<S>): S.RIO<R, A>
}

export const reduxEpic = <A extends Action, S>() =>
  <R>(fn: (action: S.UIO<A>, getState: T.UIO<S>) => S.RIO<R, A>) =>
    fn as ReduxEpic<R, A, S>

export type AnyReduxEpic = ReduxEpic<any, Action, any> | ReduxEpic<never, Action, any>

export function combineEpics<
  Epics extends NEA.NonEmptyArray<AnyReduxEpic>
>(
  epics: Epics
) {
  return reduxEpic<
    CombinedAction<Epics>,
    CombinedState<Epics>
  >()<CombinedEnv<Epics>>(
    (actions, getState) =>
      S.mergeAllUnbounded()(
        ...pipe(
          epics,
          NEA.map((epic) => epic(actions, getState))
        )
      )
  )
}

export function combineEpicsBroadcast<
  Epics extends NEA.NonEmptyArray<AnyReduxEpic>
>(
  epics: Epics
) {
  return reduxEpic<
    CombinedAction<Epics>,
    CombinedState<Epics>
  >()<CombinedEnv<Epics>>(
    (actions, getState) =>
      pipe(
        actions,
        S.broadcast(epics.length, 10),
        S.managed,
        S.chain((as) =>
          pipe(
            C.asArray(as),
            A.zip(epics),
            A.map(([a, epic]) => epic(a, getState)),
            S.fromIterable,
            S.flatten,
          )
        ),
      )
  )
}
