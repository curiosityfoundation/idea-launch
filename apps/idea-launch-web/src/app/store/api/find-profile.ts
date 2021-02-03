import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'

import { get, post, withHeaders } from '@idea-launch/http-client'
import { AccountState } from '@idea-launch/accounts/ui'
import { FindProfile } from '@idea-launch/api'

import { accessAppConfigM } from '../../config';
import { reduxEffect, Action } from '../constants'
import { FindProfileAction } from '../api-constants'
import { matches, foldBody } from './api-access'

export const FindProfileEffects = reduxEffect(
  (action, getState) => pipe(
    action,
    O.fromPredicate(matches(FindProfile)),
    O.fold(
      () => T.succeed([]),
      FindProfileAction.matchStrict({
        APIReset: (a) => T.succeed([]),
        APIRequested: (a) => pipe(
          getState,
          T.map((s) => s.account),
          T.chain(
            AccountState.matchStrict({
              LoggedOut: () => T.succeed([]),
              LoggingOut: () => T.succeed([]),
              LoggedIn: () => T.succeed([
                Action.of.APIRequestStarted({
                  payload: {
                    endpoint: FindProfile.name,
                    body: a.payload.body
                  }
                })
              ]),
              LoggingIn: () => T.succeed([]),
            })
          )
        ),
        APIRequestStarted: (a) => pipe(
          getState,
          T.map((s) => s.account),
          T.chain(
            AccountState.matchStrict({
              LoggedOut: () => T.succeed([]),
              LoggingOut: () => T.succeed([]),
              LoggedIn: ({ idToken }) => pipe(
                accessAppConfigM((config) =>
                  pipe(
                    get(`${config.functionsUrl}/${FindProfile.name}`),
                    withHeaders({
                      authorization: `Bearer ${idToken}`,
                    })
                  )
                ),
                T.chain((resp) =>
                  pipe(
                    resp.body,
                    foldBody(FindProfile),
                    T.map(
                      FindProfile.Response.matchStrict({
                        Success: (response) => [
                          Action.of.APIRequestSucceeded({
                            payload: {
                              endpoint: FindProfile.name,
                              response,
                            }
                          }),
                          Action.of.AddEntries({
                            payload: {
                              table: 'profiles',
                              entries: [response.profile],
                            }
                          }),
                        ],
                        NotFound: (response) => [
                          Action.of.APIRequestSucceeded({
                            payload: {
                              endpoint: FindProfile.name,
                              response,
                            }
                          })
                        ],
                        Failure: (response) => [
                          Action.of.APIRequestSucceeded({
                            payload: {
                              endpoint: FindProfile.name,
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
                        endpoint: FindProfile.name,
                        reason: e._tag === 'HTTPErrorRequest'
                          ? `${e._tag}: ${e.error.message}`
                          : `${e._tag}: ${e.response.status}`
                      }
                    })
                  ])
                ),
              ),
              LoggingIn: () => T.succeed([]),
            })
          )
        ),
        APIRequestFailed: () => T.succeed([]),
        APIRequestSucceeded: () => T.succeed([]),
      }),
    )
  )
)
