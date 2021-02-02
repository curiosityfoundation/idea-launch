import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as nanoid from 'nanoid';

import { UUIDGen } from './uuid-gen'

export const NanoidUUIDLive = L.pure(UUIDGen)({
  generate: T.effectTotal(() => nanoid.nanoid()),
  generateLen: (len) => T.effectTotal(() => nanoid.nanoid(len)),
})
