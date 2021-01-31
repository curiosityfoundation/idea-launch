import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function';
import * as O from '@effect-ts/core/Option'
import { decoder } from '@effect-ts/morphic/Decoder';

import { AnyEndpoint } from '@idea-launch/api';

import { Action } from '../constants';
import { APIAction } from '../api-constants';

export const matches = (endpoint: AnyEndpoint) => (a: APIAction) =>
  APIAction.verified(a) && a.payload.endpoint === endpoint.name

export const foldBody = <E extends AnyEndpoint>(endpoint: E): (o: O.Option<unknown>) => T.UIO<E['_RespA']> =>
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
