import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import * as O from '@effect-ts/core/Option'
import { decoder } from '@effect-ts/morphic/Decoder';

import { request } from '@idea-launch/http-client'
import { FindProfile } from '@idea-launch/api';

import { accessAppConfigM } from '../../config';
import { log } from '../../logger';
import { Action, epic } from '../constants';

export const FetchProfileEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.ProfileRequested),
    S.mapM(() =>
      pipe(
        accessAppConfigM((config) =>
          request('GET', 'JSON', 'JSON')(
            `${config.functionsUrl}/${FindProfile.name}`
          ),
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
                decoder(FindProfile.result).decode,
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
