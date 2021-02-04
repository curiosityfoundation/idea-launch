import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import firebase from 'firebase'

import { accessFirebaseAppM } from './firebase-app'

export interface FirebaseStorage {
  storage: firebase.storage.Storage
}

export const FirebaseStorage = tag<FirebaseStorage>()

export const accessFirebaseStorage = T.accessService(FirebaseStorage)
export const accessFirebaseStorageM = T.accessServiceM(FirebaseStorage)

const makeFirebaseStorage = accessFirebaseAppM(
  ({ app }) =>
    T.effectTotal(
      (): FirebaseStorage => ({
        storage: app.storage()
      })
    ),
)

export const FirebaseStorageClientLive = L.fromEffect(FirebaseStorage)(makeFirebaseStorage)
