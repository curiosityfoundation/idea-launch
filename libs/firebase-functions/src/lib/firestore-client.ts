import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'

import { accessFirebaseAdminAppM } from './firebase-admin'

export interface FirestoreClient {
  client: FirebaseFirestore.Firestore
}

export const FirestoreClient = tag<FirestoreClient>()

export const accessFirestoreClient = T.accessService(FirestoreClient)
export const accessFirestoreClientM = T.accessServiceM(FirestoreClient)

const makeFirestoreClient = accessFirebaseAdminAppM(
  (admin) =>
    T.effectTotal(
      (): FirestoreClient => ({
        client: admin.app.firestore()
      })
    ),
)

export const FirestoreClientLive = L.fromEffect(FirestoreClient)(makeFirestoreClient)
