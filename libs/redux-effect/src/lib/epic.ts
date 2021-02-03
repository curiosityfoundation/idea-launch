import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Action } from 'redux'

import { AnyReduxEffect } from './effect'
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

export function fromReduxEffect<
  ReduxEffect extends AnyReduxEffect
>(
  effect: ReduxEffect
) {
  return reduxEpic<
    ReduxEffect['_A'],
    ReduxEffect['_S']
  >()<ReduxEffect['_R']>(
    (actions, state) => pipe(
      actions,
      S.mapM((a) =>
        effect(a, state)
      ),
      S.flattenIterables,
    )
  )
}

export function combineEpics<
  Epics extends NEA.NonEmptyArray<AnyReduxEpic>
>(
  epics: Epics
) {
  return reduxEpic<
    CombinedAction<Epics>,
    CombinedState<Epics>
  >()<CombinedEnv<Epics>>(
    (actions, state) => pipe(
      epics,
      NEA.map((s) => s(actions, state)),
      S.fromIterable,
      S.flatten,
    )
  )
}
