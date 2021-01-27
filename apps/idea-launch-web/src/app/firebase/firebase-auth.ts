import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function';
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

import { Auth, AuthError } from '@idea-launch/accounts/ui'
import { Authorized } from '@idea-launch/accounts/model'

import { FirebaseAuthClient } from './firebase-auth-client';
import { FirebaseLoginProvider } from './firebase-login-provider';

const failWithFirebaseError = T.fromPromiseWith(
  (err: any) => new AuthError(err.code)
)

const makeFirebaseAuthLive =
  T.accessServices({
    client: FirebaseAuthClient,
    provider: FirebaseLoginProvider
  })(({ client, provider }): Auth => ({
    logOut: T.fromPromiseDie(() =>
      client.auth.signOut()
    ),
    logInWithGoogle: pipe(
      failWithFirebaseError(() =>
        client.auth.signInWithPopup(provider.google)
      ),
      T.chain((result) =>
        pipe(
          failWithFirebaseError(() =>
            result.user.getIdToken()
          ),
          T.map((token) =>
            Authorized.build({
              idToken: token,
              userId: result.user.uid as UUID,
            })
          ),
        )
      ),
    )
  }))

export const FirebaseAuthLive = L.fromEffect(Auth)(makeFirebaseAuthLive)

