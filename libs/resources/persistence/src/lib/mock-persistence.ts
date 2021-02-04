import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'

import { mockResources } from '@idea-launch/resources/model'

import { ResourcesPersistence } from './resources-persistence'

export const ResourcesPersistenceMock = L.pure(ResourcesPersistence)({
  listResources: T.succeed(mockResources),
})
