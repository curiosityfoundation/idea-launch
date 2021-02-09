import * as L from '@effect-ts/core/Effect/Layer'
import * as A from '@effect-ts/core/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { identity, pipe } from '@effect-ts/core/Function'
import { encoder } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import { formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'

import { FirestoreClient } from '@idea-launch/firebase-functions'
import { log, Logger } from '@idea-launch/logger'
import { UUIDGen } from '@idea-launch/uuid-gen'

import { Project } from '@idea-launch/projects/model'

import { ProjectsPersistence, ProjectPersistenceError } from './projects-persistence'

export const makeProjectsPersistence = T.accessServices({
  firestore: FirestoreClient,
  logger: Logger,
  uuid: UUIDGen,
})(
  ({ firestore, logger, uuid }): ProjectsPersistence => ({
    createProject: (opts, owner) =>
      pipe(
        uuid.generate,
        T.map((id) =>
          Project.build({
            ...opts,
            id,
            created: new Date(),
            modified: O.none,
            owner,
          })
        ),
        T.chain((project) =>
          pipe(
            project,
            encoder(Project).encode,
            T.chain((raw) =>
              T.fromPromiseWith(
                (err: any) => new ProjectPersistenceError(err.code)
              )(() => firestore.client
                .collection('projects')
                .doc(project.id)
                .set(raw)
              )
            ),
            T.andThen(
              T.succeed(project)
            )
          )
        )
      ),
    deleteProject: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listProjectByOwner: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listProjects: (page) =>
      pipe(
        T.fromPromiseWith(
          (err: any) => new ProjectPersistenceError(err.code)
        )(() =>
          firestore.client
            .collection('projects')
            .limit(10)
            .get()
        ),
        T.chain((snapshot) =>
          pipe(
            snapshot.docs,
            A.map((doc) =>
              pipe(
                doc.data(),
                strictDecoder(Project).decode,
                T.map(O.some),
                T.catchAll((errors) =>
                  pipe(
                    errors,
                    formatValidationErrors,
                    A.map(
                      (err) => logger.warn(`project ${doc.id} failed validation: ${err}`),
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
      ),
    createComment: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listCommentsByOwner: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listCommentsByProjectId: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    createReaction: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    deleteReaction: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listReactionsByProjectId: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
  })
)

export const ProjectsPersistenceLive = L.fromEffect(ProjectsPersistence)(makeProjectsPersistence)
