import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';

import { request } from '@idea-launch/http-client'
import { ListResources } from '@idea-launch/api';

import { accessAppConfigM } from '../../config';
import { Action, epic } from '../constants';
import { shouldRequest, foldBody } from './api-access';

export const FetchResourcesEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(shouldRequest(ListResources)),
    S.chain(() =>
      S.mergeAll(2)(
        S.fromIterable([
          Action.of.APIRequestStarted({
            payload: {
              endpoint: ListResources.name
            }
          })
        ]),
        pipe(
          S.fromIterableM(
            pipe(
              accessAppConfigM((config) =>
                request(ListResources.method, 'JSON', 'JSON')(
                  `${config.functionsUrl}/${ListResources.name}`
                ),
              ),
              T.chain((resp) =>
                pipe(
                  resp.body,
                  foldBody(ListResources),
                  T.map(
                    ListResources.Response.matchStrict<Action[]>({
                      Success: (response) => [
                        Action.of.APIRequestSucceeded({
                          payload: {
                            endpoint: ListResources.name,
                            response,
                          }
                        }),
                        Action.of.AddEntries({
                          payload: {
                            table: 'resources',
                            entries: response.resources,
                          }
                        })
                      ],
                      Failure: (response) => [
                        Action.of.APIRequestSucceeded({
                          payload: {
                            endpoint: ListResources.name,
                            response,
                          }
                        }),
                      ],
                    })
                  ),
                )
              ),
              T.catchAll((e) =>
                T.succeed([
                  Action.of.APIRequestFailed({
                    payload: {
                      endpoint: ListResources.name,
                      reason: e._tag === 'HTTPErrorRequest'
                        ? `${e._tag}: ${e.error.message}`
                        : `${e._tag}: ${e.response.status}`
                    }
                  })
                ])
              )
            ),
          ),
        )
      )
    )
  )
)
