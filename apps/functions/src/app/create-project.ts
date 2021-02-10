import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { CreateProject, handler } from '@idea-launch/api'
import { accessFunctionsRequestContextM } from '@idea-launch/firebase-functions'
import { createProject } from '@idea-launch/projects/persistence'

import { authenticateAndFindProfile, makeValidationFailureReason } from './util'

export const handleCreateProject = handler(CreateProject)(
  ({ Body, Response }) => pipe(
    authenticateAndFindProfile({
      NoProfile: () => T.succeed(
        Response.of.Failure({
          reason: 'No profile created'
        })
      ),
      Authenticated: (profile) =>
        pipe(
          accessFunctionsRequestContextM(
            (context) => pipe(
              context.request.body,
              strictDecoder(Body).decode,
              T.mapError(
                makeValidationFailureReason,
              )
            ),
          ),
          T.chain((body) =>
            pipe(
              createProject(
                body,
                profile.classCode,
                profile.id
              ),
              T.mapError((e) => e.reason),
              T.map((project) =>
                Response.of.Success({
                  project,
                }),
              )
            )
          ),
          T.catchAll((reason) =>
            T.succeed(
              Response.of.Failure({
                reason,
              }),
            )
          ),
        ),
      NotAuthenticated: (status) =>
        T.succeed(
          Response.of.Failure({
            reason: status.reason,
          })
        ),
    }),
    T.chain(encode(Response)),
  )
)