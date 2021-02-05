import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as logger from 'firebase-functions/lib/logger'

import { Logger } from '@idea-launch/logger'

export const FunctionsLogger = L.pure(Logger)({
  log: (s, ...ss) =>
    T.effectTotal(() => {
      logger.log(s, ...s)
    }),
  warn: (s, ...ss) => T
    .effectTotal(() => {
      logger.warn(s, ...s)
    }),
})
