import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { encoder } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import { formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'

import { FirestoreClient } from '@idea-launch/firebase-functions'
import { Logger } from '@idea-launch/logger'
import { UUIDGen } from '@idea-launch/uuid-gen'

import { Profile } from '@idea-launch/profiles/model'

import { ProfilesPersistence, ProfilePersistenceError } from './profiles-persistence'

export const makeProfilesPersistence = T.accessServices({
  firestore: FirestoreClient,
  logger: Logger,
  uuid: UUIDGen,
})(
  ({ firestore, logger, uuid }): ProfilesPersistence => ({
    updateProfile: (opts) =>
      T.succeed(
        Profile.build({
          ...opts,
          owner: '',
          classCode: '',
          id: '',
          created: new Date(),
          modified: new Date(),
        })
      ),
    findByOwner: (owner) =>
      pipe(
        T.fromPromiseWith(
          (err: any) => new ProfilePersistenceError(err.code)
        )(() =>
          firestore.client
            .collection('resources')
            .where('owner', '==', owner)
            .get()
        ),
        T.map((snapshot) =>
          A.head(snapshot.docs)
        ),
        T.chain(
          O.fold(
            () => T.succeed(O.none),
            (doc) => pipe(
              doc.data(),
              strictDecoder(Profile).decode,
              T.map(O.some),
              T.catchAll((errors) =>
                pipe(
                  errors,
                  formatValidationErrors,
                  A.map(
                    (err) => logger.warn(`profile ${doc.id} failed validation: ${err}`),
                  ),
                  T.collectAllPar,
                  T.andThen(
                    T.succeed(O.none)
                  )
                )
              )
            )
          )
        ),
      ),
    createProfile: (opts) =>
      pipe(
        uuid.generate,
        T.map((id) =>
          Profile.build({
            ...opts,
            id,
            created: new Date(),
            modified: null,
          })
        ),
        T.chain((profile) =>
          pipe(
            profile,
            encoder(Profile).encode,
            T.chain((raw) =>
              T.fromPromiseWith(
                (err: any) => new ProfilePersistenceError(err.code)
              )(() => firestore.client
                .collection('resources')
                .doc(profile.id)
                .set(raw)
              )
            ),
            T.andThen(T.succeed(profile))
          )
        )
      )
  })
)

export const ProfilesPersistenceLive = L.fromEffect(ProfilesPersistence)(makeProfilesPersistence)
