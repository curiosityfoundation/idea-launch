import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { Observable, EMPTY } from 'rxjs'
import { mapTo, filter, map, mergeMap, ignoreElements, distinctUntilChanged } from 'rxjs/operators'
import { configureStore } from '@reduxjs/toolkit'
import * as RxObservable from 'redux-observable'

import {
  embed,
  embedT,
  epic,
  makeEpicMiddleware,
  makeMiddleware
} from './redux-effect'

describe.skip('bindings', () => {

  interface Init { type: 'init' }

  interface Done { type: 'done' }

  const Done: Done = { type: 'done' }

  interface Dep { a: { type: 'done' } }

  const e = epic<Init | Done, {}>()(
    (actions) => pipe(
      actions,
      S.mapM(() =>
        T.access((dep: Dep) => dep.a)
      )
    )
  )

  const dep: Dep = { a: { type: 'done' } }

  const provideDep = T.provide({ a: Done })

  describe('embed', () => {

    it('embeds trivial example', async () => {

      const [o] = embed(e)(provideDep)

      const action$ = new Observable<Init>((subscriber) => {
        subscriber.next({ type: 'init' })
        subscriber.complete()
      })

      const state$ = new Observable<{}>((subscriber) => {
        subscriber.next({})
        subscriber.complete()
      })

      const vals: (Init | Done)[] = []

      await o(action$, state$).forEach((a) => {
        vals.push(a)
      })

      expect(vals).toEqual([Done])

    })

  })

  describe('embedT', () => {

    it('embeds trivial example', async () => {

      const o = await pipe(
        embedT(e),
        provideDep,
        T.runPromise
      )

      const action$ = new Observable<Init>((subscriber) => {
        subscriber.next({ type: 'init' })
        subscriber.next({ type: 'init' })
        subscriber.next({ type: 'init' })
        subscriber.next({ type: 'init' })
        subscriber.complete()
      })

      const state$ = new Observable<{}>((subscriber) => {
        subscriber.next({})
        subscriber.complete()
      })

      const vals: (Init | Done)[] = []

      await o(action$ as any, state$ as any, {}).forEach((a) => {
        vals.push(a)
      })

      expect(vals).toEqual([Done, Done, Done, Done])

    })

  })

  describe('makeEpicMiddleware', () => {

    it('embed with reduxobservable middleware', async () => {

      const valsInEpic: (Init | Done)[] = []
      const valsInStore: (Init | Done)[] = []
      const valsInRxJsEpic: (Init | Done)[] = []

      const pushEpic = epic<Init | Done, {}>()(
        (actions) => pipe(
          actions,
          S.filter((a) => a.type === 'init'),
          S.mapM((a) =>
            pipe(
              T.effectTotal(() => {
                console.log(a);
                valsInEpic.push(a)
              }),
              T.andThen(T.access((dep: Dep) => dep.a))
            )
          ),
          S.mapConcat(() => [])
        )
      )

      const pushRxJsEpic = (action$) =>
        action$.pipe(
          filter((a: Init | Done) => a.type === 'init'),
          map((a: Init | Done) => {
            valsInRxJsEpic.push(a)
            return Done
          }),
          mergeMap(() => EMPTY)
        )

      const testEpicMiddleware = RxObservable.createEpicMiddleware()

      function testMiddleware(store) {
        return (next) => (action) => {
          valsInStore.push(action)
          return next(action)
        }
      }

      const embedded = embed(pushEpic)(provideDep)
      const rootEpic = RxObservable.combineEpics(embedded, pushRxJsEpic)

      const program = pipe(

        T.effectTotal(() => {
          const store = configureStore({
            devTools: false,
            reducer: (s) => s,
            middleware: [
              testEpicMiddleware,
              testMiddleware,
            ]
          })
          return store
        }),
        T.chain((store) =>
          pipe(
            T.effectTotal(() => {
              testEpicMiddleware.run(rootEpic)
            }),
            T.andThen(
              T.effectTotal(() => {
                store.dispatch({ type: 'init' })
                store.dispatch({ type: 'init' })
                store.dispatch({ type: 'init' })
                store.dispatch({ type: 'init' })
              })
            )
          )
        )
      )

      await pipe(
        program,
        provideDep,
        T.runPromise
      )

      expect(valsInRxJsEpic).toEqual(valsInStore)
      expect(valsInEpic).toEqual(valsInRxJsEpic)

    })

    it('embedTs trivial example', async () => {

      const valsInEpic: (Init | Done)[] = []
      const valsInStore: (Init | Done)[] = []
      const valsInRxJsEpic: (Init | Done)[] = []

      const pushEpic = epic<Init | Done, {}>()(
        (actions) => pipe(
          actions,
          S.filter((a) => a.type === 'init'),
          S.mapM((a) =>
            pipe(
              T.effectTotal(() => {
                console.log(a);
                valsInEpic.push(a)
              }),
              T.andThen(T.access((dep: Dep) => dep.a))
            )
          ),
          S.mapConcat(() => [])
        )
      )

      const pushRxJsEpic = (action$) =>
        action$.pipe(
          filter((a: Init | Done) => a.type === 'init'),
          map((a: Init | Done) => {
            valsInRxJsEpic.push(a)
            return Done
          }),
          mergeMap(() => EMPTY)
        )

      const testEpicMiddleware = RxObservable.createEpicMiddleware()

      function testMiddleware({ getState }) {
        return next => action => {
          valsInStore.push(action)
          return next(action)
        }
      }

      const program = pipe(
        makeMiddleware([pushEpic]),
        T.chain((middleware) =>
          pipe(
            T.effectTotal(() => {
              const store = configureStore({
                devTools: false,
                reducer: (s) => s,
                middleware: [
                  testMiddleware,
                  middleware.middleware,
                  testEpicMiddleware,
                ]
              })
              return store
            }),
            T.chain((store) =>
              pipe(
                middleware.runRootEpic,
                T.andThen(
                  T.effectTotal(() => {
                    testEpicMiddleware.run(pushRxJsEpic)
                  })
                ),
                T.andThen(
                  T.effectTotal(() => {
                    store.dispatch({ type: 'init' })
                    store.dispatch({ type: 'init' })
                    store.dispatch({ type: 'init' })
                    store.dispatch({ type: 'init' })
                  })
                )
              )
            )
          )
        )
      )

      await pipe(
        program,
        provideDep,
        T.runPromise
      )

      expect(valsInRxJsEpic).toEqual(valsInStore)
      expect(valsInEpic).toEqual(valsInRxJsEpic)

    })

  })

})