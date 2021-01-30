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

const shouldRequest = (endpoint: AnyEndpoint) => (a: Action) =>
  Action.is.APIRequested(a) && a.payload.endpoint === endpoint.name

const foldBody = (endpoint: AnyEndpoint) =>
  O.fold(
    () => T.succeed(
      Action.of.APIRequestFailed({
        payload: {
          endpoint: endpoint.name,
          reason: 'no body present on response'
        }
      })
    ),
    (body: unknown) => pipe(
      body,
      decoder(endpoint.Response).decode,
      T.map((response: (typeof endpoint)['_RespA']) =>
        Action.of.APIRequestSucceeded({
          payload: {
            endpoint: endpoint.name,
            response,
          }
        }),
      ),
      T.catchAll((e) =>
        T.succeed(
          Action.of.APIRequestFailed({
            payload: {
              endpoint: endpoint.name,
              reason: 'decodeError'
            }
          })
        )
      )
    )
  )

const pairWithIdToken = (actions: S.UIO<Action>, state: S.UIO<State>) =>
  pipe(
    S.zipWithLatest(
      actions,
      state,
    )((a, s) => [a, s] as const),
    S.mapM(log),
    S.filterMap(([a, s]) =>
      State.account.matchStrict({
        LoggedIn: ({ idToken }) => O.some([idToken, a] as const),
        LoggedOut: () => O.none,
        LoggingIn: () => O.none,
        LoggingOut: () => O.none,
      })(s.account)
    ),
  )

// export const FetchProfileEpic = epic(
//   (actions, state) => pipe(
//     pairWithIdToken(
//       pipe(
//         actions,
//         S.filter(shouldRequest(FindProfile)),
//         S.mapM(log),
//       ),
//       state,
//     ),
//     S.chain(([idToken, a]) =>
//       S.fromIterable([
//         Action.of.APIRequestStarted({
//           payload: {
//             endpoint: FindProfile.name,
//           }
//         })
//       ]),
//       S.fromEffect(
//         pipe(
//           accessAppConfigM((config) =>
//             pipe(
//               get(`${config.functionsUrl}/${FindProfile.name}`),
//               withHeaders({
//                 authorization: `Bearer ${idToken}`,
//               })
//             )
//           ),
//           T.chain((resp) =>
//             pipe(
//               resp.body,
//               foldBody(FindProfile),
//             )
//           ),
//           T.catchAll((e) =>
//             T.succeed(
//               Action.of.APIRequestFailed({
//                 payload: {
//                   endpoint: FindProfile.name,
//                   reason: e._tag === 'HTTPErrorRequest'
//                     ? `${e._tag}: ${e.error.message}`
//                     : `${e._tag}: ${e.response.status}`
//                 }
//               })
//             )
//           ),
//         )
//       ),
//     ),
//     S.mapM(log),
//   )
// )

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
          S.fromEffect(
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
                    () => T.succeed(
                      Action.of.APIRequestFailed({
                        payload: {
                          endpoint: FindProfile.name,
                          reason: 'no body present on response'
                        }
                      })
                    ),
                    (body) => pipe(
                      body,
                      decoder(FindProfile.Response).decode,
                      T.map((response) =>
                        Action.of.APIRequestSucceeded({
                          payload: {
                            endpoint: FindProfile.name,
                            response,
                          }
                        }),
                      ),
                      T.catchAll((e) =>
                        T.succeed(
                          Action.of.APIRequestFailed({
                            payload: {
                              endpoint: FindProfile.name,
                              reason: 'decodeError'
                            }
                          })
                        )
                      )
                    )
                  ),
                )
              ),
              T.catchAll((e) =>
                T.succeed(
                  Action.of.APIRequestFailed({
                    payload: {
                      endpoint: FindProfile.name,
                      reason: e._tag === 'HTTPErrorRequest'
                        ? `${e._tag}: ${e.error.message}`
                        : `${e._tag}: ${e.response.status}`
                    }
                  })
                )
              ),
            )
          ),
        )
      )
    )
  )
)
