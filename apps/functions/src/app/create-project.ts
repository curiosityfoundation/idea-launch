import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { CreateProject, handler } from '@idea-launch/api'
import { accessFunctionsRequestContextM } from '@idea-launch/firebase-functions'
import { createProject } from '@idea-launch/projects/persistence'

import { authenticate } from './util'

export const handleCreateProject = handler(CreateProject)(
  ({ Body, Response }) => authenticate({
    Authenticated: (status) =>
      pipe(
        accessFunctionsRequestContextM(
          (context) => pipe(
            context.request.body,
            strictDecoder(Body).decode,
            T.mapError((e) => 'decode error')
          ),
        ),
        T.chain((body) =>
          pipe(
            createProject(body, status.decodedId.uid),
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
        T.chain(encode(Response)),
      ),
    NotAuthenticated: (status) =>
      pipe(
        T.succeed(
          Response.of.Failure({
            reason: status.reason,
          })
        ),
        T.chain(encode(Response)),
      )
  })
)