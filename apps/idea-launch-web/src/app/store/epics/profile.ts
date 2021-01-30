import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import * as O from '@effect-ts/core/Option'
import { decoder } from '@effect-ts/morphic/Decoder';

import { get, withHeaders } from '@idea-launch/http-client'
import { FindProfile } from '@idea-launch/api';

import { accessAppConfigM } from '../../config';
import { log } from '../../logger';
import { Action, epic, State } from '../constants';

export const FetchProfileEpic = epic(
  (actions, state) => pipe(
    S.zipWithLatest(
      state,
      actions,
    )((s, a) => [s, a] as const),
    S.filterMap(([s, a]) =>
      State.account.is.LoggedIn(s.account)
        && Action.is.ProfileRequested(a)
        ? O.some([s.account, a] as const)
        : O.none
    ),
    S.mapM(([account]) =>
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
                Action.of.ProfileRequestFailed({
                  payload: 'no body present on response'
                })
              ),
              (body) => pipe(
                body,
                decoder(FindProfile.Response).decode,
                T.map((result) =>
                  Action.of.ProfileRequestSucceeded({
                    payload: result
                  }),
                ),
              )
            ),
            T.tap(log),
          )
        ),
        T.catchAll(() =>
          T.succeed(
            Action.of.ProfileRequestFailed({
              payload: 'some error happened'
            })
          )
        ),
      )
    )
  )
)
