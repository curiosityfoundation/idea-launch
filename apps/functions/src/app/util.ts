import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { ExtractUnion } from '@effect-ts/morphic/Adt/utils'

import { accessFuntionsAuthStatusM, AuthStatus } from '@idea-launch/firebase-functions'
import { warn } from '@idea-launch/logger'

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