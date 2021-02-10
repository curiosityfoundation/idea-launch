import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { CreateComment, handler } from '@idea-launch/api'
import { accessFunctionsRequestContextM } from '@idea-launch/firebase-functions'
import { createComment } from '@idea-launch/projects/persistence'

import { authenticateAndFindProfile, makeValidationFailureReason } from './util'

export const handleCreateComment = handler(CreateComment)(
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
              createComment(
                body,
                profile.classCode,
                profile.id
              ),
              T.mapError((e) => e.reason),
              T.map((comment) =>
                Response.of.Success({
                  comment,
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