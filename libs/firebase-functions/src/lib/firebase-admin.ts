import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as admin from 'firebase-admin';

export interface FirebaseAdminApp {
  app: admin.app.App
}

export const FirebaseAdminApp = tag<FirebaseAdminApp>()

export const accessFirebaseAdminApp = T.accessService(FirebaseAdminApp)
export const accessFirebaseAdminAppM = T.accessServiceM(FirebaseAdminApp)

const makeFirebaseAdminAppLive =
  T.effectTotal(() => ({
    app: admin.apps.length > 0
      ? admin.app()
      : admin.initializeApp()
  }))

export const FirebaseAdminAppLive = L.fromEffect(FirebaseAdminApp)(makeFirebaseAdminAppLive)
