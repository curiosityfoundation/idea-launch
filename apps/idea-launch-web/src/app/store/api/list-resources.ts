import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'

import { get } from '@idea-launch/http-client'
import { ListResources } from '@idea-launch/api'

import { accessAppConfigM } from '../../config';
import { reduxEffect, Action } from '../constants'
import { ListResourcesAction } from '../api-constants'
import { matches, foldBody } from './api-access'

export const ListResourcesEffects = reduxEffect(
  (action) => pipe(
    action,
    O.fromPredicate(matches(ListResources)),
    O.fold(
      () => T.succeed([]),
      ListResourcesAction.matchStrict({
        APIRequested: () =>
          T.succeed([
            Action.of.APIRequestStarted({
              payload: {
                endpoint: ListResources.name,
              }
            })
          ]),
        APIRequestStarted: (a) => pipe(
          accessAppConfigM((config) =>
            get(`${config.functionsUrl}/${ListResources.name}`)
          ),
          T.chain((resp) =>
            pipe(
              resp.body,
              foldBody(ListResources),
              T.map(
                ListResources.Response.matchStrict({
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
                    }),
                  ],
                  Failure: (response) => [
                    Action.of.APIRequestSucceeded({
                      payload: {
                        endpoint: ListResources.name,
                        response,
                      }
                    })
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
          ),
        ),
        APIRequestFailed: () => T.succeed([]),
        APIRequestSucceeded: () => T.succeed([]),
      }),
    )
  )
)
