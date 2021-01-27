import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import * as O from '@effect-ts/core/Option'
import { decoder } from '@effect-ts/morphic/Decoder';

import { request } from '@idea-launch/http-client'
import { Resource } from '@idea-launch/resources/model';
import { Success } from '@idea-launch/api';

import { accessAppConfigM } from '../../config';
import { log } from '../../logger';
import { Action, epic } from '../constants';

export const FetchResourcesEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.ResourcesRequested),
    S.mapM(() =>
      pipe(
        accessAppConfigM((config) =>
          request('GET', 'JSON', 'JSON')(
            `${config.functionsUrl}/ListResources`
          ),
        ),
        T.chain((resp) =>
          pipe(
            resp.body,
            O.fold(
              () => T.succeed(
                Action.of.ResourcesRequestFailed({})
              ),
              (body) => pipe(
                body,
                decoder(Success).decode,
                T.map((success) =>
                  Action.of.ResourcesRequestSuccess({
                    payload: success.resources
                  })
                ),
              )
            ),
            T.tap(log),
          )
        ),
        T.catchAll(() =>
          T.succeed(
            Action.of.ResourcesRequestFailed({})
          )
        ),
      )
    )
  )
)