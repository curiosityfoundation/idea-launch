import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function'
import { encoder } from '@effect-ts/morphic/Encoder'

import { get, withHeaders } from '@idea-launch/http-client'
import { ListResources } from '@idea-launch/api'
import { reduxEpic } from '@idea-launch/redux-effect'

import { accessAPIConfigM } from '../config'
import { APIAction } from '../constants'
import { foldBody } from './api-access'

export const ListResourcesEpic = reduxEpic<APIAction, {}>()(
  (actions) => pipe(
    actions,
    S.filter(APIAction.is.APIRequested),
    S.filter((a) => a.payload.endpoint === ListResources.name),
    S.mapM((a) =>
      pipe(
        accessAPIConfigM((config) =>
          pipe(
            a.payload.body,
            encoder(ListResources.Body).encode,
            T.chain((body) =>
              get(`${config.functionsUrl}/${ListResources.name}`)
            ),
            withHeaders({
              authorization: `Bearer ${a.payload.jwt}`,
            })
          )
        ),
        T.chain((resp) =>
          pipe(
            resp.body,
            foldBody(ListResources),
            T.map(
              ListResources.Response.matchStrict({
                Success: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: ListResources.name,
                      response,
                    }
                  }),
                Failure: (response) =>
                  APIAction.of.APIRequestSucceeded({
                    payload: {
                      endpoint: ListResources.name,
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
                endpoint: ListResources.name,
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
