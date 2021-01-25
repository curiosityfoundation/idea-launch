import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import * as NEA from '@effect-ts/core/NonEmptyArray'
import { Observable } from 'rxjs'
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

type AnyEpic<S> = Epic<any, any, S> | Epic<never, any, S>

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type CombinedEnv<S, Epics extends NEA.NonEmptyArray<AnyEpic<S>>> =
  UnionToIntersection<Epics[number]['_R']>

type CombinedActions<S, Epics extends NEA.NonEmptyArray<AnyEpic<S>>> =
  Epics[number]['_A']

function toNever(_: any): never {
  return undefined as never;
};

export function embed<S, Epics extends NEA.NonEmptyArray<AnyEpic<S>>>(
  ...epics: Epics
): (
    provider: (
      _: T.Effect<CombinedEnv<S, Epics>, never, unknown>
    ) => T.Effect<T.DefaultEnv, never, unknown>
  ) => NEA.NonEmptyArray<RxJsEpic<
    CombinedActions<S, Epics>,
    S,
    CombinedActions<S, Epics>
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

export function epic<A, S>(): <R>(
  fn: (action: S.UIO<A>, state: S.UIO<S>) => S.RIO<R, A>
) => Epic<R, A, S> {
  return (fn) => fn as any
}
