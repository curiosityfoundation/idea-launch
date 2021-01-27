import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'
import firebase from 'firebase'

import { accessFirebaseConfigM } from './firebase-config'

export interface FirebaseApp {
  app: firebase.app.App
}

export const FirebaseApp = tag<FirebaseApp>()

export const accessFirebaseApp = T.accessService(FirebaseApp)
export const accessFirebaseAppM = T.accessServiceM(FirebaseApp)

const makeFirebaseAppLive = accessFirebaseConfigM(
  (config) =>
    pipe(
      T.effectTotal(() =>
        firebase.apps.length > 0
          ? firebase.app()
          : firebase.initializeApp(config)
      ),
      T.map((app): FirebaseApp => ({ app }))
    )
)

export const FirebaseAppLive = L.fromEffect(FirebaseApp)(makeFirebaseAppLive)