import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import firebase from 'firebase'

export interface FirebaseLoginProvider {
  google: firebase.auth.GoogleAuthProvider
}

export const FirebaseLoginProvider = tag<FirebaseLoginProvider>()

export const accessFirebaseLoginProvider = T.accessService(FirebaseLoginProvider)
export const accessFirebaseLoginProviderM = T.accessServiceM(FirebaseLoginProvider)

export const FirebaseLoginProviderLive = L.pure(FirebaseLoginProvider)(({
  google: new firebase.auth.GoogleAuthProvider(),
}))
