import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Action } from 'redux'

import {
  ReduxEffectType,
  CombinedAction,
  CombinedEnv,
  CombinedState
} from './util'

export interface ReduxEffect<R, A extends Action, S> extends ReduxEffectType<R, A, S> {
  (action: A, getState: T.UIO<S>): T.RIO<R, A.Array<A>>
}

export const reduxEffect = <A extends Action, S>() =>
  <R>(fn: (action: A, getState: T.UIO<S>) => T.RIO<R, A.Array<A>>) =>
    fn as ReduxEffect<R, A, S>

export type AnyReduxEffect = ReduxEffect<any, Action, any> | ReduxEffect<never, Action, any>

export function combineEffects<
  Effects extends NEA.NonEmptyArray<AnyReduxEffect>
>(
  effects: Effects
) {
  return reduxEffect<
    CombinedAction<Effects>,
    CombinedState<Effects>
  >()<CombinedEnv<Effects>>(
    (action, getState) => pipe(
      effects,
      NEA.map((e) => e(action, getState)),
      T.collectAllPar,
      T.map(A.flatten)
    )
  )
}
