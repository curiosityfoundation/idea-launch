import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'
import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import firebase from 'firebase'

import { embed } from '@idea-launch/redux-effect'

import { State, Action, reducer } from '../constants'
import { LoginEpic, FirebaseAuthLive } from './auth'
import { ConfigLive } from './config'
import { FetchClientLive } from './http-client'
import { FetchResourcesEpic } from './resources'

export const createStore = () => {

  const epicMiddleware = createEpicMiddleware<Action, Action, State, State>()

  const store = configureStore({
    reducer,
    devTools: true,
    middleware: [
      epicMiddleware,
    ]
  })

  const fbConfig = {
    apiKey: process.env.NX_API_KEY,
    authDomain: process.env.NX_AUTH_DOMAIN,
    projectId: process.env.NX_PROJECT_ID,
    storageBucket: process.env.NX_STORAGE_BUCKET,
    messagingSenderId: process.env.NX_MESSAGING_SENDER_ID,
    appId: process.env.NX_APP_ID,
    measurementId: process.env.NX_MEASUREMENT_ID
  }

  const fbApp = firebase.apps.length > 0
    ? firebase.app()
    : firebase.initializeApp(fbConfig);

  const provideEnv = pipe(
    L.all(
      FirebaseAuthLive(
        fbApp.auth(),
        new firebase.auth.GoogleAuthProvider()
      ),
      FetchClientLive(fetch),
      ConfigLive(process.env.NX_FUNCTIONS_URL)
    ),
    T.provideLayer,
  )

  const embeddedEpics = embed(
    LoginEpic,
    FetchResourcesEpic,
  )(provideEnv)

  const rootEpic = combineEpics(...embeddedEpics)

  epicMiddleware.run(rootEpic)

  return store

}
