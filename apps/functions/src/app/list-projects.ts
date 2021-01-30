import { pipe } from '@effect-ts/core/Function'
import * as T from '@effect-ts/core/Effect'
import { encode } from '@effect-ts/morphic/Encoder'
import { strictDecoder } from '@effect-ts/morphic/StrictDecoder'
import * as A from '@effect-ts/core/Array'
import * as M from '@effect-ts/morphic'

import { listProjects } from '@idea-launch/projects/persistence'
import { Project, Comment } from '@idea-launch/projects/model'

import { accessFunctionsRequestContextM, FunctionsAuthStatus, FunctionsRequestContext } from '@idea-launch/firebase-functions'

import {
  ListResources,
  FindProfile,
  ListProjects,
  handler,
} from '@idea-launch/api'

import { authenticate } from './authenticate'

export const handleListProjects = handler(ListProjects)(
  ({ Response, Body }) => authenticate({
    NotAuthenticated: (status) =>
      pipe(
        T.succeed(
          Response.of.Failure({
            reason: status.reason,
          })
        ),
        T.chain(encode(Response)),
      ),
    Authenticated: () =>
      accessFunctionsRequestContextM(
        (context) =>
          pipe(
            context.request.body,
            strictDecoder(Body).decode,
            T.chain((body) =>
              pipe(
                listProjects(body.page),
                T.map((projects) =>
                  Response.of.Success({
                    page: body.page,
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
                    Response.of.Failure({
                      reason: err.reason,
                    })
                  )
                )
              )
            ),
            T.catchAll(() =>
              T.succeed(
                Response.of.Failure({
                  reason: 'validation error',
                }),
              )
            ),
            T.chain(encode(Response)),
          )
      ),
  })
)
