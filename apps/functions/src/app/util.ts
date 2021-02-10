import * as A from '@effect-ts/core/Array'
import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import * as O from '@effect-ts/core/Option'
import { ExtractUnion } from '@effect-ts/morphic/Adt/utils'
import { formatValidationErrors } from '@effect-ts/morphic/Decoder/reporters'
import { Errors } from '@effect-ts/morphic/Decoder'

import { findByOwner } from '@idea-launch/profiles/persistence'
import { accessFuntionsAuthStatusM, AuthStatus } from '@idea-launch/firebase-functions'
import { warn } from '@idea-launch/logger'
import { Profile } from '@idea-launch/profiles/model'

export function authenticate<R1, R2, E, A>(opts: {
  NotAuthenticated: (status: ExtractUnion<AuthStatus, 'tag', 'NotAuthenticated'>) => T.Effect<R1, E, A>
  Authenticated: (status: ExtractUnion<AuthStatus, 'tag', 'Authenticated'>) => T.Effect<R2, E, A>
}) {
  return accessFuntionsAuthStatusM((auth) =>
    pipe(
      auth.status,
      AuthStatus.matchStrict<T.Effect<R1 & R2, E, A>>(opts)
    )
  )
}

export function authenticateAndFindProfile<R1, R2, R3, E, A>(opts: {
  NotAuthenticated: (status: ExtractUnion<AuthStatus, 'tag', 'NotAuthenticated'>) => T.Effect<R1, E, A>
  NoProfile: (status: ExtractUnion<AuthStatus, 'tag', 'Authenticated'>) => T.Effect<R2, E, A>
  Authenticated: (profile: Profile, status: ExtractUnion<AuthStatus, 'tag', 'Authenticated'>) => T.Effect<R3, E, A>
}) {
  return authenticate({
    NotAuthenticated: opts.NotAuthenticated,
    Authenticated: (status) =>
      pipe(
        findByOwner(status.decodedId.uid),
        T.catchAll(
          () => opts.NoProfile(status)
        ),
        T.chain(
          O.fold<Profile, T.Effect<R1 & R2 & R3, E, A>, T.Effect<R1 & R2 & R3, E, A>>(
            () => opts.NoProfile(status),
            (profile) => opts.Authenticated(profile, status),
          )
        ),
      )
  })
}

export const logDefect = <R, E, A>(effect: T.Effect<R, E, A>) =>
  pipe(
    effect,
    T.catchAllDefect((err) =>
      pipe(
        err,
        warn,
        T.andThen(
          T.die(err)
        )
      )
    )
  )

export const makeValidationFailureReason = (errs: Errors) =>
  pipe(
    errs,
    formatValidationErrors,
    A.join('\n'),
  )