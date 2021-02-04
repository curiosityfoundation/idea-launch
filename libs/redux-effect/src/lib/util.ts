import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Action } from 'redux'

export interface ReduxEffectType<R, A extends Action, S, O extends Action = A> {
  _R: R
  _A: A
  _S: S
  _O: O
}

type AnyReduxEffectType = ReduxEffectType<any, Action, any> | ReduxEffectType<never, Action, any>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type AnyReduxEffectTypes = NEA.NonEmptyArray<AnyReduxEffectType>

export type CombinedEnv<Ts extends AnyReduxEffectTypes> =
  UnionToIntersection<Ts[number]['_R']>

export type CombinedAction<Ts extends AnyReduxEffectTypes> =
  Ts[number]['_A']

export type CombinedState<Ts extends AnyReduxEffectTypes> =
  UnionToIntersection<Ts[number]['_S']>

export type CombinedOutAction<Ts extends AnyReduxEffectTypes> =
  Ts[number]['_O']
