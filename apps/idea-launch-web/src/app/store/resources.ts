import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';

import { Action, epic } from '../constants';

export const FetchResourcesEpic = epic(
  (actions) => pipe(
    actions,
    S.filter(Action.is.ResourcesRequested),
    S.map(() => Action.of.ResourcesRequestSuccess({ payload: [] }))
  )
)
