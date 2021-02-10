import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'

import { get, withHeaders } from '@idea-launch/http-client'
import { ListProjects } from '@idea-launch/api'
import { reduxEpic } from '@idea-launch/redux-effect'

import { accessAPIConfigM } from '../config'
import { ListProjectsAction } from '../constants'
import { foldBody } from './api-access'

export const ListProjectsEpic = reduxEpic<ListProjectsAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(ListProjectsAction.is.APIRequested),
    S.filter((a) => a.payload.endpoint === ListProjects.name),
    S.mapM((a) =>
      pipe(
        accessAPIConfigM((config) =>
          pipe(
            get(`${config.functionsUrl}/${ListProjects.name}?page=1`),
            withHeaders({
              authorization: `Bearer ${a.payload.jwt}`,
            })
          )
        ),
        T.chain((resp) =>
          pipe(
            resp.body,
            foldBody(ListProjects),
            T.map(
              ListProjects.Response.matchStrict({
                Success: (response) =>
                  ListProjectsAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: ListProjects.name,
                      response,
                    }
                  }),
                Failure: (response) =>
                  ListProjectsAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: ListProjects.name,
                      response,
                    }
                  })
              })
            ),
          )
        ),
        T.catchAll((e) =>
          T.succeed(
            ListProjectsAction.of.APIRequestFailed({
              payload: {
                endpoint: ListProjects.name,
                reason: e._tag === 'HTTPErrorRequest'
                  ? `${e._tag}: ${e.error.message}`
                  : `${e._tag}: ${e.response.status}`
              }
            })
          )
        )
      )
    )
  )
)
