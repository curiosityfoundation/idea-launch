import * as T from '@effect-ts/core/Effect'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import * as L from '@effect-ts/core/Effect/Layer'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { configureStore } from '@reduxjs/toolkit'

import {
  ReduxQueueOf,
  ActionWithState,
  reduxEffect,
  makeReduxEffectMiddleware
} from './redux-effect'

describe('custom middleware', () => {

  interface Init {
    type: 'Init'
  }

  interface Done {
    type: 'Done'
  }

  const Action = makeADT('type')({
    Init: ofType<Init>(),
    Done: ofType<Done>(),
  })

  type Action = ADTType<typeof Action>

  type State = {}

  const Init = Action.of.Init({})
  const Done = Action.of.Done({})

  interface Dep { a: Action }

  const provideDep = T.provide<Dep>({ a: Done })

  it('trivial example', async () => {

    const valsInEffect: Action[] = []
    const valsInStore: Action[] = []

    const pushEffect = reduxEffect<Action, State>()(
      Action.matchStrict({
        Init: (a) => T.andThen(T.succeed([Done]))(
          T.effectTotal(() => {
            valsInEffect.push(a)
          })
        ),
        Done: () => T.succeed([]),
      })
    )

    function testMiddleware({ getState }) {
      return next => action => {
        valsInStore.push(action)
        return next(action)
      }
    }

    const AQ = ReduxQueueOf<Action, State>()

    const program = pipe(
      makeReduxEffectMiddleware(pushEffect)(AQ),
      T.chain((middleware) =>
        pipe(
          T.effectTotal(() => {
            const store = configureStore({
              devTools: false,
              reducer: (s) => s,
              middleware: [
                testMiddleware,
                middleware.middleware,
              ]
            })
            return store
          }),
          T.chain((store) =>
            T.collectAllPar([
              middleware.runEffects,
              T.delay(10)(
                T.effectTotal(() => {
                  store.dispatch(Init)
                  store.dispatch(Init)
                  store.dispatch(Init)
                  store.dispatch(Init)
                })
              )
            ])
          )
        )
      )
    )

    const AQLive = L.fromEffect(AQ)(
      pipe(
        T.do,
        T.bind(
          'actionsWithState',
          () => Q.makeUnbounded<ActionWithState<Action, State>>(),
        ),
        T.bind(
          'middlewareApi',
          () => Ref.makeRef(null),
        ),
        T.map(
          ({ actionsWithState, middlewareApi }): ReduxMiddleware<Action, State> => ({
            actionsWithState,
            middlewareApi
          })
        )
      )
    )

    pipe(
      program,
      provideDep,
      T.provideSomeLayer(AQLive),
      T.runPromise
    )

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(valsInStore).toEqual([
          Init,
          Init,
          Init,
          Init,
          Done,
          Done,
          Done,
          Done,
        ])
        expect(valsInEffect).toEqual([
          Init,
          Init,
          Init,
          Init,
        ])
        resolve(undefined)
      }, 50)
    })

  })

})