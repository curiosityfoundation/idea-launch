import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { configureStore } from '@reduxjs/toolkit'

import { combineEpics, reduxEpic } from './epic'
import { ReduxQueueOf, makeReduxQueue, } from './queue'
import { makeReduxEpicMiddleware } from './middleware'

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

const Init = Action.of.Init({})
const Done = Action.of.Done({})

interface Dep { a: Action }

const provideDep = T.provide<Dep>({ a: Done })

const epic = reduxEpic<Action, {}>()(
  (actions) => pipe(
    actions,
    S.filter(Action.is.Init),
    S.map(() => Action.of.Done({}))
  )
)

const combined = combineEpics([
  epic,
  epic,
  epic,
])

describe('redux epic', () => {

  it('combines epic', async () => {

    const as = await pipe(
      combined(
        S.fromIterable([Init]),
        T.succeed({})
      ),
      S.runCollect,
      T.runPromise,
    )

    console.log('as', as)

    expect(as).toEqual([
      Done,
      Done,
      Done,
    ])

  })

  it('middleware', async () => {

    const valsInStore: Action[] = []

    function testMiddleware({ getState }) {
      return next => action => {
        valsInStore.push(action)
        return next(action)
      }
    }

    const AQ = ReduxQueueOf<Action, {}>()

    const program = pipe(
      makeReduxEpicMiddleware(combined)(AQ),
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
                })
              )
            ])
          )
        )
      )
    )

    const AQLive = L.fromEffect(AQ)(makeReduxQueue)

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
          Done,
          Done,
          Done,
        ])
        resolve(undefined)
      }, 50)
    })

  })

})