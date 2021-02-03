import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import * as O from '@effect-ts/core/Option'
import { encoder } from '@effect-ts/morphic/Encoder'

import { get, post, withHeaders } from '@idea-launch/http-client'
import { AccountState } from '@idea-launch/accounts/ui'
import { CreateProfile } from '@idea-launch/api'

import { accessAppConfigM } from '../../config';
import { Route } from '../../router';
import { reduxEffect, Action } from '../constants'
import { CreateProfileAction } from '../api-constants'
import { matches, foldBody } from './api-access'

export const CreateProfileEffects = reduxEffect(
  (action, getState) => pipe(
    action,
    O.fromPredicate(matches(CreateProfile)),
    O.fold(
      () => T.succeed([]),
      CreateProfileAction.matchStrict({
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
                    endpoint: CreateProfile.name,
                    body: a.payload.body
                  },
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
                    encoder(CreateProfile.Body).encode(a.payload.body),
                    T.chain((body) =>
                      post(
                        `${config.functionsUrl}/${CreateProfile.name}`,
                        body,
                      )
                    ),
                    withHeaders({
                      authorization: `Bearer ${idToken}`,
                    })
                  )
                ),
                T.chain((resp) =>
                  pipe(
                    resp.body,
                    foldBody(CreateProfile),
                    T.map(
                      CreateProfile.Response.matchStrict({
                        Success: (response) => [
                          Action.of.APIRequestSucceeded({
                            payload: {
                              endpoint: CreateProfile.name,
                              response,
                            }
                          }),
                          Action.of.APIRequested({
                            payload: {
                              endpoint: 'FindProfile',
                              body: {},
                            }
                          }),
                          Action.of.LocationPushed({
                            payload: Route.of.Welcome({})
                          }),
                        ],
                        Failure: (response) => [
                          Action.of.APIRequestSucceeded({
                            payload: {
                              endpoint: CreateProfile.name,
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
                        endpoint: CreateProfile.name,
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
          ),
        ),
        APIRequestFailed: () => T.succeed([]),
        APIRequestSucceeded: () => T.succeed([]),
      }),
    )
  )
)
