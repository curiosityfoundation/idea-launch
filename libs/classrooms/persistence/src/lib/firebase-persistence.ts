import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { pipe, identity } from '@effect-ts/core/Function'
import { decoder } from '@effect-ts/morphic/Decoder'
import { formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'

import { Resource } from '@idea-launch/resources/model'
import { FirestoreClient } from '@idea-launch/firebase-functions'
import { Logger } from '@idea-launch/logger'

import { ClassroomsPersistence, ClassroomsPersistenceError } from './classrooms-persistence'
import { Classroom } from '@idea-launch/classrooms/model'

const makeClassroomsPersistence = T.accessServices({
  firestore: FirestoreClient,
  logger: Logger,
})(
  ({ firestore, logger }): ClassroomsPersistence => ({
    findClassroom: (classCode) =>
      pipe(
        T.fromPromiseWith(
          (err: any) => new ClassroomsPersistenceError(err.code)
        )(() =>
          firestore.client
            .collection('classrooms')
            .where('classCode', '==', classCode)
            .limit(1)
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
              decoder(Classroom).decode,
              T.map(O.some),
              T.catchAll((errors) =>
                pipe(
                  errors,
                  formatValidationErrors,
                  A.map(
                    (err) => logger.warn(`classroom ${doc.id} failed validation: ${err}`),
                  ),
                  T.collectAllPar,
                  T.andThen(
                    T.succeed(O.none)
                  )
                )
              )
            )
          )
        )
      )
  })
)

export const ClassroomsPersistenceLive = L.fromEffect(ClassroomsPersistence)(makeClassroomsPersistence)
