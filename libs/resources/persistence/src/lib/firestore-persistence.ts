import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { pipe, identity } from '@effect-ts/core/Function'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import { formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'

import { Resource } from '@idea-launch/resources/model'
import { FirestoreClient } from '@idea-launch/firebase-functions'
import { Logger } from '@idea-launch/logger'

import { ResourcesPersistence, ResourcesPersistenceError } from './resources-persistence'

const makeResourcesPersistence = T.accessServices({
  firestore: FirestoreClient,
  logger: Logger,
})(
  ({ firestore, logger }): ResourcesPersistence => ({
    listResources: pipe(
      T.fromPromiseWith(
        (err: any) => new ResourcesPersistenceError(err.code)
      )(() =>
        firestore.client
          .collection('resources')
          .get()
      ),
      T.chain((snapshot) =>
        pipe(
          snapshot.docs,
          A.map((doc) =>
            pipe(
              doc.data(),
              strictDecoder(Resource).decode,
              T.map(O.some),
              T.catchAll((errors) =>
                pipe(
                  errors,
                  formatValidationErrors,
                  A.map(
                    (err) => logger.warn(`resource ${doc.id} failed validation: ${err}`),
                  ),
                  T.collectAllPar,
                  T.andThen(
                    T.succeed(O.none)
                  )
                )
              )
            )
          ),
          T.collectAllPar,
        )
      ),
      T.map(
        A.filterMap(identity)
      )
    )
  })
)

export const ResourcesPersistenceLive = L.fromEffect(ResourcesPersistence)(makeResourcesPersistence)
