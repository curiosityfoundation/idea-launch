import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { encoder } from '@effect-ts/morphic/Encoder'

import { post, withHeaders } from '@idea-launch/http-client'
import { CreateProfile } from '@idea-launch/api'
import { reduxEpic } from '@idea-launch/redux-effect'

import { accessAPIConfigM } from '../config'
import { APIAction } from '../constants'
import { foldBody } from './api-access'

export const CreateProfileEpic = reduxEpic<APIAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(APIAction.is.APIRequested),
    S.filter((a) => a.payload.endpoint === CreateProfile.name),
    S.mapM((a) =>
      pipe(
        accessAPIConfigM((config) =>
          pipe(
            a.payload.body,
            encoder(CreateProfile.Body).encode,
            T.chain((body) =>
              post(
                `${config.functionsUrl}/${CreateProfile.name}`,
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
            foldBody(CreateProfile),
            T.map(
              CreateProfile.Response.matchStrict({
                Success: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: CreateProfile.name,
                      response,
                    }
                  }),
                Failure: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: CreateProfile.name,
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
                endpoint: CreateProfile.name,
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
