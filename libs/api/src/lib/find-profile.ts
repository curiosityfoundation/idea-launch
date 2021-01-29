import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import * as O from '@effect-ts/core/Option'
import * as M from '@effect-ts/morphic'

import { findByOwner } from '@idea-launch/profiles/persistence'
import { Profile } from '@idea-launch/profiles/model'

import { endpoint, NoArgs } from './api'

const Failure_ = M.make((F) =>
  F.interface({
    tag: F.stringLiteral('Failure'),
    reason: F.string()
  }, { name: 'Failure' })
)

export interface Failure extends M.AType<typeof Failure_> { }
export interface FailureRaw extends M.EType<typeof Failure_> { }
export const Failure = M.opaque<FailureRaw, Failure>()(Failure_)

const NotFound_ = M.make((F) =>
  F.interface({
    tag: F.stringLiteral('NotFound'),
  }, { name: 'NotFound' })
)

export interface NotFound extends M.AType<typeof NotFound_> { }
export interface NotFoundRaw extends M.EType<typeof NotFound_> { }
export const NotFound = M.opaque<NotFoundRaw, NotFound>()(NotFound_)

const Success_ = M.make((F) =>
  F.interface({
    tag: F.stringLiteral('Success'),
    profile: Profile(F),
  }, { name: 'Success' })
)

export interface Success extends M.AType<typeof Success_> { }
export interface SuccessRaw extends M.EType<typeof Success_> { }
export const Success = M.opaque<SuccessRaw, Success>()(Success_)

export const Result = M.makeADT('tag')({
  Failure,
  Success,
  NotFound,
})

export type Result = M.AType<typeof Result>

export const FindProfile = endpoint({
  name: 'FindProfile',
  result: Result,
  args: NoArgs,
  handler: (data, uid) =>
    pipe(
      findByOwner(uid),
      T.chain(
        O.fold(
          () => T.succeed(
            Result.of.NotFound({})
          ),
          (profile) => T.succeed(
            Result.of.Success({
              profile,
            }),
          ),
        )
      ),
      T.catchAll((err) =>
        T.succeed(
          Result.of.Failure({
            reason: err.reason,
          })
        )
      ),
      T.chain(encode(Result)),
    )
  })
