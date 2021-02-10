import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { listProjects } from '@idea-launch/projects/persistence'
import { accessFunctionsRequestContextM } from '@idea-launch/firebase-functions'
import { ListProjects, handler } from '@idea-launch/api'

import { authenticateAndFindProfile, makeValidationFailureReason } from './util'

export const handleListProjects = handler(ListProjects)(
  ({ Response, Body }) => pipe(
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
          listProjects(profile.classCode, 1),
          T.map((projects) =>
            Response.of.Success({
              page: 1,
              projects,
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
