import * as A from '@effect-ts/core/Array'
import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { encode } from '@effect-ts/morphic/Encoder'

import { listProjects, listCommentsByProjectId } from '@idea-launch/projects/persistence'
import { ListProjects, handler } from '@idea-launch/api'

import { authenticateAndFindProfile } from './util'

export const handleListProjects = handler(ListProjects)(
  ({ Response }) => pipe(
    authenticateAndFindProfile({
      NoProfile: () =>
        T.succeed(
          Response.of.Failure({
            reason: 'No profile created',
          })
        ),
      NotAuthenticated: (status) =>
        T.succeed(
          Response.of.Failure({
            reason: status.reason,
          })
        ),
      Authenticated: (profile) =>
        pipe(
          T.do,
          T.bind('projects', () => listProjects(profile.classCode, 1)),
          T.bind('comments', ({ projects }) =>
            pipe(
              projects,
              A.map((p) =>
                listCommentsByProjectId(profile.classCode, p.id)
              ),
              T.collectAllPar,
              T.map(A.flatten),
            )
          ),
          T.map(({ projects, comments }) =>
            Response.of.Success({
              page: 1,
              projects,
              comments,
            })
          ),
          T.catchAll((err) =>
            T.succeed(
              Response.of.Failure({
                reason: err.reason,
              })
            )
          ),
        )
    }),
    T.chain(encode(Response)),
  )
)
