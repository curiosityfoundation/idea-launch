import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import * as O from '@effect-ts/core/Option'
import { decoder } from '@effect-ts/morphic/Decoder';

import { request } from '@idea-launch/http-client'
import { Resource } from '@idea-launch/resources/model';

import { Action, epic } from '../constants';
import { accessConfigM } from './config';

export const FetchResourcesEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.ResourcesRequested),
    S.mapM(() =>
      pipe(
        accessConfigM((config) =>
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
                decoder(Resource).decode,
                T.map((r) =>
                  Action.of.ResourcesRequestSuccess({
                    payload: [r]
                  })
                ),
              )
            )
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
