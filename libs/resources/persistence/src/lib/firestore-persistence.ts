import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import { report } from '@effect-ts/morphic/Decoder/reporters'

import { Resource } from '@idea-launch/resources/model'
import { FirestoreClient } from '@idea-launch/firebase-functions'
import { Logger } from '@idea-launch/logger'

import { ResourcesPersistence, ResourcesPersistenceError } from './resources-persistence'

const fromFirestorePromise = T.fromPromiseWith(
  (err: any) => new ResourcesPersistenceError(err.code)
)

const makeResourcesPersistence = T.accessServices({
  firestore: FirestoreClient,
  logger: Logger,
})(
  ({ firestore, logger }): ResourcesPersistence => ({
    listResources: pipe(
      T.do,
      T.bind('snapshot', () =>
        fromFirestorePromise(() =>
          firestore.client
            .collection('resources')
            .get()
        ),
      ),
      T.bind('resources', ({ snapshot }) =>
        pipe(
          snapshot.docs,
          A.map((doc) =>
            pipe(
              doc.data(),
              strictDecoder(Resource).decode,
              report,
              T.chainError((errors) =>
                T.collectAllPar(
                  A.map_(
                    errors,
                    (err) => logger.warn(`resource ${doc.id} failed validation: ${err}`),
                  ),
                )
              )
            )
          ),
          T.collectAllSuccesses,
        )
      ),
      T.map(({ resources }) => resources)
    )
  })
)

export const ResourcesPersistenceLive = L.fromEffect(ResourcesPersistence)(makeResourcesPersistence)
