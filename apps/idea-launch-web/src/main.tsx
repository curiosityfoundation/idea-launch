import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'

import { AppLayer } from './environments/environment'
import { App } from './app/app'

T.runPromise(
  pipe(
    App,
    T.provideLayer(AppLayer)
  )
).catch(console.warn)
