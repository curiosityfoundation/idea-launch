import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import * as M from '@effect-ts/morphic'

import { listResources } from '@idea-launch/resources/persistence'
import { Resource } from '@idea-launch/resources/model'

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

const Success_ = M.make((F) =>
  F.interface({
    tag: F.stringLiteral('Success'),
    resources: F.array(Resource(F)),
  }, { name: 'Success' })
)

export interface Success extends M.AType<typeof Success_> { }
export interface SuccessRaw extends M.EType<typeof Success_> { }
export const Success = M.opaque<SuccessRaw, Success>()(Success_)

export const Result = M.makeADT('tag')({
  Failure,
  Success,
})

export const ListResources = endpoint({
  name: 'ListResources',
  result: Result,
  args: NoArgs,
  handler: () =>
    pipe(
      listResources,
      T.map((resources) =>
        Result.of.Success({
          resources,
        })
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
