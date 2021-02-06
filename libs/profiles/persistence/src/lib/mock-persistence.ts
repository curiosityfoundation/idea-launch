import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'
import * as O from '@effect-ts/core/Option'
import * as A from '@effect-ts/core/Array'

import { mockProfiles, Profile } from '@idea-launch/profiles/model'

import { ProfilesPersistence } from './profiles-persistence'
import { pipe } from '@effect-ts/core/Function'

export const ProfilesPersistenceMock = L.pure(ProfilesPersistence)((() => {
  let id = 100
  const profiles: Profile[] = []
  const persistence: ProfilesPersistence = {
    createProfile: (opts) => T.effectTotal(() => {
      const profile = {
        ...opts,
        id: String(id++),
        created: new Date,
        modified: O.none,
      }
      profiles.push(profile)
      return profile
    }),
    updateProfile: () => T.unit,
    findByOwner: (owner) => T.effectTotal(() => {
      return pipe(
        profiles,
        A.findFirst((p) => p.owner === owner)
      )
    }),
  }
  return persistence
})())
