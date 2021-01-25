import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'
import firebase from 'firebase';

import { Auth, AuthError, logInWithGoogle } from '@idea-launch/accounts/ui'
import { Authorized } from '@idea-launch/accounts/model'

import { epic, Action } from '../constants';

export function FirebaseAuthLive(
  auth: firebase.auth.Auth,
  loginProvider: firebase.auth.GoogleAuthProvider
) {
  return L.pure(Auth)({
    logOut: T.fromPromiseDie(auth.signOut),
    logInWithGoogle: pipe(
      T.fromPromiseWith(
        (err: any) => new AuthError(err.code)
      )(() => auth.signInWithPopup(loginProvider)),
      T.chain((result) =>
        pipe(
          T.fromPromiseWith(
            (err: any) => new AuthError(err.code)
          )(() => result.user.getIdToken()),
          T.map((token) => Authorized.build({
            idToken: token,
            userId: result.user.uid as UUID,
          })),
        )
      ),
    )
  })
}

export const LoginEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.LoginStarted),
    S.mapM((a) =>
      pipe(
        logInWithGoogle,
        T.map((payload) =>
        Action.of.LoginSuccess({
            payload
          })
        ),
        T.catchAll((err) =>
          T.succeed(
            Action.of.LoginFailure({
              payload: err.reason
            })
          )
        )
      )
    )
  )
)
