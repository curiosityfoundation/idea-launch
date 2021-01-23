import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { configureStore } from '@reduxjs/toolkit'
import { Action } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'

import { embed, epic } from '@idea-launch/redux-effect'
import { pipe } from '@effect-ts/core/Function'

export const createStore = () => {

  const epicMiddleware = createEpicMiddleware<Action, Action, {}>()

  interface DepA { a: { type: 'PONG' } }
  interface DepB { b: { type: '1234' } }

  const pingPongEpic = epic<Action<'PING'>, {}, Action<'PONG'>>()(
    (a, s) => pipe(
      a,
      S.filter((a) => a.type === 'PING'),
      S.mapM(() =>
        T.access((dep: DepA) => dep.a)
      )
    )
  )

  const numEpic = epic<Action<'PONG'>, {}, Action<'1234'>>()(
    (a, s) => pipe(
      a,
      S.filter((a) => a.type === 'PONG'),
      S.mapM(() =>
        T.access((dep: DepB) => dep.b)
      )
    )
  )

  const store = configureStore({
    reducer: (x) => ({ message: 'hello world' }),
    devTools: true,
    middleware: [
      epicMiddleware,
    ]
  })

  const provideEnv = pipe(
    T.provideSome((): DepA & DepB => ({
      a: { type: 'PONG' },
      b: { type: '1234' },
    })),
  )

  const embeddedEpics = embed(
    pingPongEpic,
    numEpic,
  )(provideEnv)

  const rootEpic = combineEpics(...embeddedEpics)

  epicMiddleware.run(rootEpic)

  store.dispatch({ type: 'PING' })

  return store

}
