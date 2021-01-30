import * as M from '@effect-ts/morphic'

import { Profile, CreateProfile as Body } from '@idea-launch/profiles/model'

import { endpoint, Empty } from './api'

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

export const Response = M.makeADT('tag')({
  Failure,
  Success,
  NotFound,
})

export type Response = M.AType<typeof Response>

export const CreateProfile = endpoint({
  name: 'CreateProfile',
  method: 'POST',
  Response,
  Body,
})
