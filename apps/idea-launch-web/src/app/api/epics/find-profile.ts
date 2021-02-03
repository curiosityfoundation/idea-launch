import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { encoder } from '@effect-ts/morphic/Encoder'

import { post, withHeaders } from '@idea-launch/http-client'
import { FindProfile } from '@idea-launch/api'
import { reduxEpic } from '@idea-launch/redux-effect'

import { accessAPIConfigM } from '../config'
import { APIAction } from '../constants'
import { foldBody } from './api-access'

export const FindProfileEffects = reduxEpic<APIAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(APIAction.is.APIRequested),
    S.filter((a) => a.payload.endpoint === FindProfile.name),
    S.mapM((a) =>
      pipe(
        accessAPIConfigM((config) =>
          pipe(
            a.payload.body,
            encoder(FindProfile.Body).encode,
            T.chain((body) =>
              post(
                `${config.functionsUrl}/${FindProfile.name}`,
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
            foldBody(FindProfile),
            T.map(
              FindProfile.Response.matchStrict({
                Success: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: FindProfile.name,
                      response,
                    }
                  }),
                NotFound: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: FindProfile.name,
                      response,
                    }
                  }),
                Failure: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: FindProfile.name,
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
                endpoint: FindProfile.name,
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
