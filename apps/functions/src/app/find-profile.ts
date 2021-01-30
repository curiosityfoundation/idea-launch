import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import * as O from '@effect-ts/core/Option'

import { findByOwner } from '@idea-launch/profiles/persistence'

import {
  ListResources,
  FindProfile,
  ListProjects,
  handler,
} from '@idea-launch/api'

import { authenticate } from './authenticate'

export const handleFindProfile = handler(FindProfile)(
  ({ Response }) => authenticate({
    Authenticated: (status) =>
      pipe(
        findByOwner(String(status.decodedId)),
        T.chain(
          O.fold(
            () => T.succeed(
              Response.of.NotFound({})
            ),
            (profile) => T.succeed(
              Response.of.Success({
                profile,
              }),
            ),
          )
        ),
        T.catchAll((err) =>
          T.succeed(
            Response.of.Failure({
              reason: err.reason,
            })
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