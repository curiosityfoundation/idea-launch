import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { tag } from '@effect-ts/core/Has'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Observable } from 'rxjs'
import * as RxObservable from 'redux-observable'
import { Action } from 'redux'

import { encaseObservable, runToObservable, toObservable } from './rxjs'

export interface RxJsEpic<A, S, O = A> {
  (action$: Observable<A>, state$: Observable<S>): Observable<O>
}

export interface Epic<R, A, S> {
  _R: R
  _A: A
  _S: S
  (action: S.UIO<A>, state: S.UIO<S>): S.RIO<R, A>
}

export type AnyEpic<S> = Epic<any, any, S> | Epic<never, any, S>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type CombinedEnv<Epics extends NEA.NonEmptyArray<AnyEpic<any>>> =
  UnionToIntersection<Epics[number]['_R']>

export type CombinedActions<Epics extends NEA.NonEmptyArray<AnyEpic<any>>> =
  Epics[number]['_A']

function toNever(_: any): never {
  return undefined as never;
};

export function epic<A, S>(): <R>(
  fn: (action: S.UIO<A>, state: S.UIO<S>) => S.RIO<R, A>
) => Epic<R, A, S> {
  return (fn) => fn as any
}

export function embed<S, Epics extends NEA.NonEmptyArray<AnyEpic<S>>>(
  ...epics: Epics
): (
    provider: (
      _: T.Effect<CombinedEnv<Epics>, never, unknown>
    ) => T.Effect<T.DefaultEnv, never, unknown>
  ) => NEA.NonEmptyArray<RxJsEpic<
    CombinedActions<Epics>,
    S,
    CombinedActions<Epics>
  >> {
  return (provider) => pipe(
    epics,
    NEA.map((ep) => (action$, state$) =>
      pipe(
        toObservable(
          ep(
            encaseObservable(action$, toNever),
            encaseObservable(state$, toNever),
          ),
        ),
        provider,
        runToObservable,
      )
    )
  )
}

export function embedT<S, Epics extends NEA.NonEmptyArray<AnyEpic<S>>>(
  ...epics: Epics
): T.RIO<
  CombinedEnv<Epics>,
  RxObservable.Epic<
    CombinedActions<Epics>,
    CombinedActions<Epics>,
    S
  >
> {
  return T.access((env) =>
    RxObservable.combineEpics(
      ...pipe(
        epics,
        NEA.map((ep) => (action$, state$) =>
          pipe(
            toObservable(
              ep(
                encaseObservable(action$, toNever),
                encaseObservable(state$, toNever),
              ),
            ),
            T.provide(env),
            runToObservable,
          )
        )
      )
    )
  )
}

export interface EpicMiddleware<A extends Action, S> {
  middleware: RxObservable.EpicMiddleware<A, A, S, S>
  runRootEpic: T.UIO<void>
}

export function makeMiddleware<
  S,
  Epics extends NEA.NonEmptyArray<AnyEpic<S>>
>(epics: Epics) {

  type A = CombinedActions<Epics>

  return pipe(
    T.effectTotal(() =>
      RxObservable.createEpicMiddleware<A, A, S, S>()
    ),
    T.chain((middleware) =>
      pipe(
        embedT(...epics),
        T.map(
          (rootEpic): EpicMiddleware<A, S> => ({
            middleware,
            runRootEpic: T.effectTotal(() => {
              middleware.run(
                rootEpic
              )
            })
          })
        )
      )
    )
  )
}

export const makeEpicMiddleware = <A extends Action, S>() => tag<EpicMiddleware<A, S>>()
