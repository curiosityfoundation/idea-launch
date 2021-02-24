import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'
import { encoder } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import { report, formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'
import * as firebase from 'firebase'

import { accessFirebaseAdminApp, FirebaseAdminApp, FirestoreClient } from '@idea-launch/firebase-functions'
import { Logger, warn } from '@idea-launch/logger'
import { UUIDGen } from '@idea-launch/uuid-gen'
import { Comment, Project } from '@idea-launch/projects/model'

import { ProjectsPersistence, ProjectPersistenceError } from './projects-persistence'

const fromFirestorePromise = T.fromPromiseWith(
  (err: any) => new ProjectPersistenceError(err.code)
)

export const makeProjectsPersistence = T.accessServices({
  admin: FirebaseAdminApp,
  firestore: FirestoreClient,
  logger: Logger,
  uuid: UUIDGen,
})(
  ({ admin, firestore, logger, uuid }): ProjectsPersistence => ({
    createProject: (opts, classCode, owner) =>
      pipe(
        T.do,
        T.bind('id', () => uuid.generate),
        T.let('project', ({ id }) =>
          Project.build({
            ...opts,
            id,
            created: new Date(),
            modified: O.none,
            reactions: [],
            owner,
          })
        ),
        T.bind('projectRaw', ({ project }) =>
          encoder(Project).encode(project)
        ),
        T.bind('writeResult', ({ id, projectRaw }) =>
          fromFirestorePromise(() =>
            firestore.client
              .collection('classrooms')
              .doc(classCode)
              .collection('projects')
              .doc(id)
              .set(projectRaw)
          )
        ),
        T.map(({ project }) => project)
      ),
    deleteProject: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listProjectByOwner: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listProjects: (classCode, page) =>
      pipe(
        T.do,
        T.bind('snapshot', () =>
          fromFirestorePromise(() =>
            firestore.client
              .collection('classrooms')
              .doc(classCode)
              .collection('projects')
              .limit(10)
              .get()
          )
        ),
        T.bind('projects', ({ snapshot }) =>
          pipe(
            snapshot.docs,
            A.map((doc) =>
              pipe(
                doc.data(),
                strictDecoder(Project).decode,
                report,
                T.chainError((errors) =>
                  pipe(
                    errors,
                    A.map((err) =>
                      logger.warn(`project ${doc.id} failed validation: ${err}`),
                    ),
                    T.collectAllPar,
                  )
                )
              )
            ),
            T.collectAllSuccesses,
          )
        ),
        T.map(({ projects }) => projects)
      ),
    createComment: (opts, classCode, owner) =>
      pipe(
        T.do,
        T.bind('id', () => uuid.generate),
        T.let('comment', ({ id }) =>
          Comment.build({
            ...opts,
            id,
            created: new Date(),
            approved: true,
            owner,
          })
        ),
        T.bind('commentRaw', ({ comment }) =>
          encoder(Comment).encode(comment)
        ),
        T.bind('writeResult', ({ id, commentRaw }) =>
          fromFirestorePromise(() =>
            firestore.client
              .collection('classrooms')
              .doc(classCode)
              .collection('projects')
              .doc(opts.projectId)
              .collection('comments')
              .doc(id)
              .set(commentRaw)
          )
        ),
        T.map(({ comment }) => comment)
      ),
    listCommentsByOwner: (opts) => T.fail(
      new ProjectPersistenceError('not implemented')
    ),
    listCommentsByProjectId: (classCode, projectId) =>
      pipe(
        T.do,
        T.bind('snapshot', () =>
          fromFirestorePromise(() =>
            firestore.client
              .collection('classrooms')
              .doc(classCode)
              .collection('projects')
              .doc(projectId)
              .collection('comments')
              .get()
          )
        ),
        T.bind('comments', ({ snapshot }) =>
          pipe(
            snapshot.docs,
            A.map((doc) =>
              pipe(
                doc.data(),
                strictDecoder(Comment).decode,
                report,
                T.chainError((errors) =>
                  pipe(
                    errors,
                    A.map((err) =>
                      logger.warn(`comment ${doc.id} failed validation: ${err}`),
                    ),
                    T.collectAllPar,
                  )
                )
              )
            ),
            T.collectAllSuccesses,
          )
        ),
        T.map(({ comments }) => comments)
      ),
  })
)

export const ProjectsPersistenceLive = L.fromEffect(ProjectsPersistence)(makeProjectsPersistence)
