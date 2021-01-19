import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

import { Resource } from '@idea-launch/resources/model'

class ResourcesPersistenceError {
  readonly tag: 'ResourcesPersistenceError'
  constructor(readonly reason: string) { }
}

export interface ResourcesPersistence {
  listResources: T.IO<ResourcesPersistenceError, Resource[]>
}

export const ResourcesPersistence = tag<ResourcesPersistence>()

export const {
  listResources
} = T.deriveLifted(ResourcesPersistence)(
  [] as never[],
  ['listResources'],
  [] as never[],
)
