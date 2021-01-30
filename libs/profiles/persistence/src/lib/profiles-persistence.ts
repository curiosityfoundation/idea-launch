import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'
import * as O from '@effect-ts/core/Option'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'

import { CreateProfile, UpdateProfile, Profile } from '@idea-launch/profiles/model'

class ProfilePersistenceError {
  readonly tag: 'ProfilePersistenceError'
  constructor(readonly reason: string) { }
}

export interface ProfilesPersistence {
  createProfile: (opts: CreateProfile) => T.IO<ProfilePersistenceError, void>
  updateProfile: (opts: UpdateProfile) => T.IO<ProfilePersistenceError, void>
  findByOwner: (owner: string) => T.IO<ProfilePersistenceError, O.Option<Profile>>
}

export const ProfilesPersistence = tag<ProfilesPersistence>()

export const {
  createProfile,
  updateProfile,
  findByOwner,
} = T.deriveLifted(ProfilesPersistence)(
  ['createProfile', 'updateProfile', 'findByOwner'],
  [] as never[],
  [] as never[],
)
