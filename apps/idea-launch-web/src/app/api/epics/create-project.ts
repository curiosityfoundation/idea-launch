import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { encoder } from '@effect-ts/morphic/Encoder'

import { post, withHeaders } from '@idea-launch/http-client'
import { CreateProject } from '@idea-launch/api'
import { reduxEpic } from '@idea-launch/redux-effect'

import { accessAPIConfigM } from '../config'
import { APIAction } from '../constants'
import { foldBody } from './api-access'

export const CreateProjectEpic = reduxEpic<APIAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(APIAction.is.APIRequested),
    S.filter((a) => a.payload.endpoint === CreateProject.name),
    S.mapM((a) =>
      pipe(
        accessAPIConfigM((config) =>
          pipe(
            a.payload.body,
            encoder(CreateProject.Body).encode,
            T.chain((body) =>
              post(
                `${config.functionsUrl}/${CreateProject.name}`,
                body,
              )
            ),
            withHeaders({
              authorization: `Bearer ${a.payload.jwt}`,
            })
          )
        ),
        T.chain((resp) =>
          pipe(
            resp.body,
            foldBody(CreateProject),
            T.map(
              CreateProject.Response.matchStrict({
                Success: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: CreateProject.name,
                      response,
                    }
                  }),
                Failure: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: CreateProject.name,
                      response,
                    }
                  })
              })
            ),
          )
        ),
        T.catchAll((e) =>
          T.succeed(
            APIAction.of.APIRequestFailed({
              payload: {
                endpoint: CreateProject.name,
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
