import * as M from '@effect-ts/morphic'

import { Comment, CreateComment as CreateComment_ } from '@idea-launch/projects/model'

import { endpoint } from './api'

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
    comment: Comment(F),
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

export const CreateComment = endpoint({
  name: 'CreateComment',
  method: 'POST',
  Response,
  Body: CreateComment_,
})
