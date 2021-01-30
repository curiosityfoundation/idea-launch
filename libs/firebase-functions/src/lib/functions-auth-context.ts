import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { tag } from '@effect-ts/core/Has'
import { pipe } from '@effect-ts/core/Function'
import * as admin from 'firebase-admin'

import { FirebaseAdminApp } from './firebase-admin'
import { FunctionsRequestContext } from './functions-request'

interface Authenticated {
  tag: 'Authenticated'
  decodedId: admin.auth.DecodedIdToken
}

interface NotAuthenticated {
  tag: 'NotAuthenticated'
  reason: string
}

export const AuthStatus = makeADT('tag')({
  NotAuthenticated: ofType<NotAuthenticated>(),
  Authenticated: ofType<Authenticated>(),
})

export type AuthStatus = ADTType<typeof AuthStatus>;

export interface FunctionsAuthStatus {
  status: AuthStatus
}

export const FunctionsAuthStatus = tag<FunctionsAuthStatus>()

const makeFunctionsAuthStatus = T.accessServicesM({
  admin: FirebaseAdminApp,
  context: FunctionsRequestContext,
})(({ admin, context }) =>
  pipe(
    O.fromNullable(context.request.headers),
    O.chain((headers) => O.fromNullable(headers.authorization)),
    O.chain((authorization) => authorization.startsWith('Bearer ')
      ? O.some(authorization.split('Bearer ')[1])
      : O.none
    ),
    O.fold(
      () => T.fail('no authorization header present or header content malformed'),
      (encodedToken) => T.succeed(encodedToken),
    ),
    T.chain((encodedToken) =>
      T.fromPromiseWith(
        () => 'failed to verify authorization header content'
      )(() =>
        admin.app.auth().verifyIdToken(encodedToken)
      )
    ),
    T.map((decodedId) =>
      AuthStatus.of.Authenticated({ decodedId })
    ),
    T.catchAll((reason) =>
      T.succeed(
        AuthStatus.of.NotAuthenticated({
          reason
        })
      )
    ),
    T.map((status): FunctionsAuthStatus => ({ 
      status 
    }))
  )
)

export const accessFuntionsAuthStatus = T.accessService(FunctionsAuthStatus)
export const accessFuntionsAuthStatusM = T.accessServiceM(FunctionsAuthStatus)

export const FunctionsAuthStatusLive = L.fromEffect(FunctionsAuthStatus)(makeFunctionsAuthStatus)
