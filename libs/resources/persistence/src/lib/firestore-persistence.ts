import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { Resource } from '@idea-launch/resources/model'
import { accessFirestoreClient } from '@idea-launch/firebase-functions'

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
          A.map((doc) => doc.data()),
          A.map(strictDecoder(Resource).decode),
          T.collectAllPar,
          T.mapError(() => new ResourcesPersistenceError('decode error'))
        )
      ),
    )
  })
)

export const ResourcesPersistenceLive = L.fromEffect(ResourcesPersistence)(makeResourcesPersistence)
