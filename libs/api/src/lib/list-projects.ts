import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import * as A from '@effect-ts/core/Array'
import * as M from '@effect-ts/morphic'

import { listProjects } from '@idea-launch/projects/persistence'
import { Project, Comment } from '@idea-launch/projects/model'

import { endpoint } from './api'

const Args_ = M.make((F) => 
  F.interface({
    page: F.number(),
  }, { name: 'Args' })
)

export interface Args extends M.AType<typeof Args_> { }
export interface ArgsRaw extends M.EType<typeof Args_> { }
export const Args = M.opaque<ArgsRaw, Args>()(Args_)

const Failure_ = M.make((F) =>
  F.interface({
    tag: F.stringLiteral('Failure'),
    reason: F.string()
  }, { name: 'Failure' })
)

export interface Failure extends M.AType<typeof Failure_> { }
export interface FailureRaw extends M.EType<typeof Failure_> { }
export const Failure = M.opaque<FailureRaw, Failure>()(Failure_)

const ProjectEntry_ = M.make((F) =>
  F.intersection(
    F.interface({
      numReactions: F.number(),
      comments: F.array(Comment(F)),
    }),
    Project(F),
  )({ name: 'ProjectEntry' }),
)

export interface ProjectEntry extends M.AType<typeof ProjectEntry_> { }
export interface ProjectEntryRaw extends M.EType<typeof ProjectEntry_> { }
export const ProjectEntry = M.opaque<ProjectEntryRaw, ProjectEntry>()(ProjectEntry_)

const Success_ = M.make((F) =>
  F.interface({
    tag: F.stringLiteral('Success'),
    projects: F.array(ProjectEntry(F)),
    page: F.number(),
  }, { name: 'Success' })
)

export interface Success extends M.AType<typeof Success_> { }
export interface SuccessRaw extends M.EType<typeof Success_> { }
export const Success = M.opaque<SuccessRaw, Success>()(Success_)

export const Result = M.makeADT('tag')({
  Failure,
  Success,
})

export const ListProjects = endpoint({
  name: 'ListProjects',
  result: Result,
  args: Args,
  handler: (data) =>
    pipe(
      data,
      strictDecoder(Args).decode,
      T.chain((opts) =>
        pipe(
          listProjects(opts.page),
          T.map((projects) =>
            Result.of.Success({
              page: opts.page,
              projects: pipe(
                projects,
                A.map((p) => ({
                  ...p,
                  numReactions: 0,
                  comments: [],
                }))
              ),
            })
          ),
          T.catchAll((err) =>
            T.succeed(
              Result.of.Failure({
                reason: err.reason,
              })
            )
          )
        )
      ),
      T.catchAll(() =>
        T.succeed(
          Result.of.Failure({
            reason: 'validation error',
          }),
        )
      ),
      T.chain(encode(Result)),
    )
})
