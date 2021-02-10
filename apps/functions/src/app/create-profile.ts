import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import * as O from '@effect-ts/core/Option'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'

import { CreateProfile, handler } from '@idea-launch/api'
import { accessFunctionsRequestContextM } from '@idea-launch/firebase-functions'
import { createProfile, findByOwner } from '@idea-launch/profiles/persistence'

import { authenticate, makeValidationFailureReason } from './util'

export const handleCreateProfile = handler(CreateProfile)(
  ({ Body, Response }) => authenticate({
    Authenticated: (status) =>
      pipe(
        findByOwner(status.decodedId.uid),
        T.mapError((e) => e.reason),
        T.chain(
          O.fold(
            () =>
              accessFunctionsRequestContextM(
                (context) => pipe(
                  context.request.body,
                  strictDecoder(Body).decode,
                  T.mapError(
                    makeValidationFailureReason
                  ),
                ),
              ),
            () => T.fail('profile already created'),
          )
        ),
        T.chain((body) =>
          pipe(
            { ...body, owner: status.decodedId.uid },
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