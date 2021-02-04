import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { pipe, identity } from '@effect-ts/core/Function'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import { formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'

import { Resource } from '@idea-launch/resources/model'
import { accessFirestoreClient } from '@idea-launch/firebase-functions'
import { warn } from '@idea-launch/logger'

import { ResourcesPersistence, ResourcesPersistenceError } from './resources-persistence'

const makeResourcesPersistence = accessFirestoreClient(
  (firestore): ResourcesPersistence => ({
    listResources: pipe(
      T.fromPromiseWith(
        (err: any) => new ResourcesPersistenceError(err.code)
      )(() => firestore.client.collection('resources').limit(10).get()),
      T.chain((snapshot) =>
        pipe(
          snapshot.docs,
          A.map((doc) =>
            pipe(
              doc.data(),
              strictDecoder(Resource).decode,
              T.map(O.some),
              T.mapError(formatValidationErrors),
              T.tapError(warn),
              T.catchAll(() =>
                T.succeed(
                  O.none,
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