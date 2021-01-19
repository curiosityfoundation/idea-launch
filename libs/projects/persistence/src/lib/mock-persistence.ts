import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'

import { ProjectsPersistence } from './projects-persistence'

export const projectsPersistenceMock = L.pure(ProjectsPersistence)({
  listProjects: () => T.succeed([]),
  listCommentsByOwner: () => T.succeed([]),
  listProjectByOwner: () => T.succeed([]),
  listCommentsByProjectId: () => T.succeed([]),
  listReactionsByProjectId: () => T.succeed([]),
  createComment: () => T.unit,
  createProject: () => T.unit,
  createReaction: () => T.unit,
  deleteProject: () => T.unit,
  deleteReaction: () => T.unit,
})
