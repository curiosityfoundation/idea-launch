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

export const shouldRequest = (endpoint: AnyEndpoint) => (a: Action) =>
  Action.is.APIRequested(a) && a.payload.endpoint === endpoint.name

export const foldBody = (endpoint: AnyEndpoint) =>
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

export const pairWithIdToken = (
  actions: S.UIO<Action>,
  state: S.UIO<State>
) => pipe(
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