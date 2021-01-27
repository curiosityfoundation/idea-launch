import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import firebase from 'firebase'

import { accessFirebaseAppM } from './firebase-app'

export interface FirebaseAuthClient {
  auth: firebase.auth.Auth
}

export const FirebaseAuthClient = tag<FirebaseAuthClient>()

export const accessFirebaseAuthClient = T.accessService(FirebaseAuthClient)
export const accessFirebaseAuthClientM = T.accessServiceM(FirebaseAuthClient)

const makeFirebaseAuthClientLive = accessFirebaseAppM(
  ({ app }) =>
    T.effectTotal(
      (): FirebaseAuthClient => ({
        auth: app.auth(),
      })
    ),
)

export const FirebaseAuthClientLive = L.fromEffect(FirebaseAuthClient)(makeFirebaseAuthClientLive)