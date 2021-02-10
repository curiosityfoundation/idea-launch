import * as A from '@effect-ts/core/Array'
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
  createProject: (opts: CreateProject, classCode: string, owner: string) => T.IO<ProjectPersistenceError, Project>
  deleteProject: (opts: DeleteProject) => T.IO<ProjectPersistenceError, void>
  listProjectByOwner: (owner: string, page: number) => T.IO<ProjectPersistenceError, A.Array<Project>>
  listProjects: (classCode: string, page: number) => T.IO<ProjectPersistenceError, A.Array<Project>>
  createComment: (opts: CreateComment, classCode: string, owner: string) => T.IO<ProjectPersistenceError, Comment>
  listCommentsByOwner: (owner: UUID) => T.IO<ProjectPersistenceError, A.Array<Comment>>
  listCommentsByProjectId: (classCode: string, projectId: string) => T.IO<ProjectPersistenceError, A.Array<Comment>>
  createReaction: (opts: CreateReaction) => T.IO<ProjectPersistenceError, void>
  deleteReaction: (opts: DeleteReaction) => T.IO<ProjectPersistenceError, void>
  listReactionsByProjectId: (projectId: UUID) => T.IO<ProjectPersistenceError, A.Array<Reaction>>
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
  listCommentsByProjectId,
  listReactionsByProjectId
} = T.deriveLifted(ProjectsPersistence)(
  [
    'createProject', 
    'deleteProject', 
    'createComment', 
    'createReaction', 
    'deleteReaction',
    'listProjects',
    'listProjectByOwner',
    'listCommentsByProjectId',
    'listReactionsByProjectId'
  ],
  [] as never[],
  [] as never[],
)
