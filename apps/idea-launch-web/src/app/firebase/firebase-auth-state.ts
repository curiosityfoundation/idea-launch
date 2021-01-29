import { tag } from '@effect-ts/core/Has'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import firebase from 'firebase'

import { accessFirebaseAuthClient } from './firebase-auth-client'

interface SignedInToFirebase {
  type: 'LoggedIn'
  user: firebase.User
}

interface SignedOutOfFirebase {
  type: 'LoggedOut'
}

export const FirebaseAuthStateChanged = makeADT('type')({
  LoggedIn: ofType<SignedInToFirebase>(),
  LoggedOut: ofType<SignedOutOfFirebase>(),
})

export type FirebaseAuthStateChanged = ADTType<typeof FirebaseAuthStateChanged>

export interface FirebaseAuthState {
  changes: S.Stream<unknown, never, FirebaseAuthStateChanged>
}

export const FirebaseAuthState = tag<FirebaseAuthState>()

export const makeFirebaseAuthState =
  accessFirebaseAuthClient((client): FirebaseAuthState => ({
    changes: S.effectAsyncInterrupt(
      (cb) => {
        const unsubscribe = client.auth.onIdTokenChanged((user) => {
          if (!!user) {
            cb(T.succeed([
              FirebaseAuthStateChanged.of.LoggedIn({ user })
            ]))
          } else {
            cb(T.succeed([
              FirebaseAuthStateChanged.of.LoggedOut({})
            ]))
          }
        })
        return T.effectTotal(() => {
          unsubscribe()
        })
      }
    )
  }))

export const accessFirebaseAuthState = T.accessService(FirebaseAuthState)
export const accessFirebaseAuthStateM = T.accessServiceM(FirebaseAuthState)

export const FirebaseAuthStateLive = L.fromEffect(FirebaseAuthState)(makeFirebaseAuthState)
