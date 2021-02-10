import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'

import { ProjectsPersistence, ProjectPersistenceError } from './projects-persistence'

export const ProjectsPersistenceMock = L.pure(ProjectsPersistence)({
  listProjects: () => T.succeed([]),
  listCommentsByOwner: () => T.succeed([]),
  listProjectByOwner: () => T.succeed([]),
  listCommentsByProjectId: () => T.succeed([]),
  listReactionsByProjectId: () => T.succeed([]),
  createComment: () => T.fail(
    new ProjectPersistenceError('not implemented')
  ),
  createProject: () => T.fail(
    new ProjectPersistenceError('not implemented')
  ),
  createReaction: () => T.unit,
  deleteProject: () => T.unit,
  deleteReaction: () => T.unit,
})
