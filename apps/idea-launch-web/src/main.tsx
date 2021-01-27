import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'

import { AppLayer } from './environments/environment'
import { RenderApp } from './app/app'

T.runPromise(
  pipe(
    RenderApp,
    T.provideLayer(AppLayer)
  )
).catch(console.warn)