import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import * as O from '@effect-ts/core/Option'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { createProfile, findByOwner } from '@idea-launch/profiles/persistence'
import { CreateProfile, handler } from '@idea-launch/api'

import { authenticate } from './authenticate'
import { accessFunctionsRequestContextM } from '@idea-launch/firebase-functions'

export const handleFindProfile = handler(CreateProfile)(
  ({ Body, Response }) => authenticate({
    Authenticated: (status) =>
      pipe(
        findByOwner(String(status.decodedId)),
        T.mapError((e) => e.reason),
        T.chain(
          O.fold(
            () =>
              accessFunctionsRequestContextM(
                (context) => pipe(
                  context.request.body,
                  strictDecoder(Body).decode,
                  T.mapError((e) => 'decode error')
                ),
              ),
            () => T.fail('profile already created'),
          )
        ),
        T.chain((body) =>
          pipe(
            body,
            createProfile,
            T.mapError((e) => e.reason),
            T.map((profile) =>
              Response.of.Success({
                profile,
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
