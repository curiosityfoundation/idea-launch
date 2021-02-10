import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'

import { FindProfile, handler } from '@idea-launch/api'

import { authenticateAndFindProfile } from './util'

export const handleFindProfile = handler(FindProfile)(
  ({ Response }) => pipe(
    authenticateAndFindProfile({
      Authenticated: (profile) =>
        T.succeed(
          Response.of.Success({
            profile,
          })
        ),
      NoProfile: () =>
        T.succeed(
          Response.of.NotFound({})
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
