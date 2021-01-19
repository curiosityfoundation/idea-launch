import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'

import { ResourcesPersistence } from './resources-persistence'

export const resourcesPersistenceMock =
  L.pure(ResourcesPersistence)({
    listResources: T.succeed([]),
  })
