import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import firebase from 'firebase'

import { accessFirebaseAppM } from './firebase-app'

export interface FirebaseStorage {
  storage: firebase.storage.Storage
}

export const FirebaseStorageClient = tag<FirebaseStorage>()

export const accessFirebaseStorage = T.accessService(FirebaseStorageClient)
export const accessFirebaseStorageM = T.accessServiceM(FirebaseStorageClient)

const makeFirebaseStorage = accessFirebaseAppM(
  ({ app }) =>
    T.effectTotal(
      (): FirebaseStorage => ({
        storage: app.storage()
      })
    ),
)

export const FirebaseStorageClientLive = L.fromEffect(FirebaseStorageClient)(makeFirebaseStorage)
