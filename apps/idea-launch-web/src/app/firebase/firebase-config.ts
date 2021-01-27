import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { tag } from '@effect-ts/core/Has'

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export const FirebaseConfig = tag<FirebaseConfig>()

export const accessFirebaseConfig = T.accessService(FirebaseConfig)
export const accessFirebaseConfigM = T.accessServiceM(FirebaseConfig)

export const FirebaseConfigLive = (config: FirebaseConfig) =>
  L.pure(FirebaseConfig)(config)
  