import * as M from '@effect-ts/morphic'

import { Profile, Name } from '@idea-launch/profiles/model'

import { endpoint } from './api'

const Body_ = M.make((F) => 
  F.interface({
    name: Name(F),
    avatar: F.string(),
    classCode: F.string(),
  })
)

export interface Body extends M.AType<typeof Body_> { }
export interface BodyRaw extends M.EType<typeof Body_> { }
export const Body = M.opaque<BodyRaw, Body>()(Body_)

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
    profile: Profile(F),
  }, { name: 'Success' })
)

export interface Success extends M.AType<typeof Success_> { }
export interface SuccessRaw extends M.EType<typeof Success_> { }
export const Success = M.opaque<SuccessRaw, Success>()(Success_)

export const Response = M.makeADT('tag')({
  Failure,
  Success,
})

export type Response = M.AType<typeof Response>

export const CreateProfile = endpoint({
  name: 'CreateProfile',
  method: 'POST',
  Response,
  Body,
})
