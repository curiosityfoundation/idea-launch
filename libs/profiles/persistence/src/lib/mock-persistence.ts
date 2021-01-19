import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'
import * as O from '@effect-ts/core/Option'

import { ProfilesPersistence } from './profiles-persistence'

export const profilesPersistenceMock = L.pure(ProfilesPersistence)({
  createProfile: () => T.unit,
  updateProfile: () => T.unit,
  findByOwner: () => T.succeed(O.none),
})
