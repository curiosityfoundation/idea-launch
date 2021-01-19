import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

import {
  CreateProject,
  DeleteProject,
  Project,
  CreateComment,
  Comment,
  CreateReaction,
  DeleteReaction,
  Reaction,
} from '@idea-launch/projects/model'

export class ProjectPersistenceError {
  readonly tag: 'ProjectPersistenceError'
  constructor(readonly reason: string) { }
}

export interface ProjectsPersistence {
  createProject: (opts: CreateProject) => T.IO<ProjectPersistenceError, void>
  deleteProject: (opts: DeleteProject) => T.IO<ProjectPersistenceError, void>
  listProjectByOwner: (owner: UUID, page: number) => T.IO<ProjectPersistenceError, Project[]>
  listProjects: (page: number) => T.IO<ProjectPersistenceError, Project[]>
  createComment: (opts: CreateComment) => T.IO<ProjectPersistenceError, void>
  listCommentsByOwner: (owner: UUID) => T.IO<ProjectPersistenceError, Comment[]>
  listCommentsByProjectId: (projectId: UUID) => T.IO<ProjectPersistenceError, Comment[]>
  createReaction: (opts: CreateReaction) => T.IO<ProjectPersistenceError, void>
  deleteReaction: (opts: DeleteReaction) => T.IO<ProjectPersistenceError, void>
  listReactionsByProjectId: (projectId: UUID) => T.IO<ProjectPersistenceError, Reaction[]>
}

export const ProjectsPersistence = tag<ProjectsPersistence>()

export const {
  createProject,
  deleteProject,
  createComment,
  createReaction,
  deleteReaction,
  listProjectByOwner,
  listProjects,
} = T.deriveLifted(ProjectsPersistence)(
  [
    'createProject', 
    'deleteProject', 
    'createComment', 
    'createReaction', 
    'deleteReaction',
    'listProjects',
    'listProjectByOwner',
  ],
  [] as never[],
  [] as never[],
)
