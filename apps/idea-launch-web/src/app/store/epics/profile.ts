import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import * as O from '@effect-ts/core/Option'
import { decoder } from '@effect-ts/morphic/Decoder';

import { get, withHeaders } from '@idea-launch/http-client'
import { FindProfile, AnyEndpoint } from '@idea-launch/api';

import { accessAppConfigM } from '../../config';
import { Action, epic, State } from '../constants';
import { log } from '../../logger';

export const FetchProfileEpic = epic(
  (actions, state) => pipe(
    S.zipWithLatest(
      state,
      actions,
    )((s, a) => [s, a] as const),
    S.filterMap(([s, a]) =>
      State.account.is.LoggedIn(s.account)
        && Action.is.APIRequested(a)
        && a.payload.endpoint === FindProfile.name
        ? O.some([s.account, a] as const)
        : O.none
    ),
    S.chain(([account]) =>
      pipe(
        S.fromIterable([
          Action.of.APIRequestStarted({
            payload: {
              endpoint: FindProfile.name,
            }
          })
        ]),
        S.merge(
          S.fromIterableM(
            pipe(
              accessAppConfigM((config) =>
                pipe(
                  get(`${config.functionsUrl}/${FindProfile.name}`),
                  withHeaders({
                    authorization: `Bearer ${account.idToken}`,
                  })
                )
              ),
              T.chain((resp) =>
                pipe(
                  resp.body,
                  O.fold(
                    () => T.succeed([
                      Action.of.APIRequestFailed({
                        payload: {
                          endpoint: FindProfile.name,
                          reason: 'no body present on response'
                        }
                      })
                    ]),
                    (body) => pipe(
                      body,
                      decoder(FindProfile.Response).decode,
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
                      T.catchAll((e) =>
                        T.succeed([
                          Action.of.APIRequestFailed({
                            payload: {
                              endpoint: FindProfile.name,
                              reason: 'decodeError'
                            }
                          })
                        ])
                      )
                    )
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
            )
          ),
        )
      )
    )
  )
)
