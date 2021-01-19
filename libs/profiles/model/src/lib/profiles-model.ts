import * as M from '@effect-ts/morphic'

const Profile_ = M.make((F) => 
  F.interface({
    owner: F.uuid(),
    name: F.string(),
    avatar: F.string(),
    id: F.uuid(),
    created: F.date(),
    modified: F.optional(F.date()),
  }, { name: 'Profile' })
)

export interface Profile extends M.AType<typeof Profile_> { }
export interface ProfileRaw extends M.EType<typeof Profile_> { }
export const Profile = M.opaque<ProfileRaw, Profile>()(Profile_)

const UpdateProfile_ = M.make((F) => 
  F.interface({
    name: F.string(),
    avatar: F.string(),
  }, { name: 'UpdateProfile' })
)

export interface UpdateProfile extends M.AType<typeof UpdateProfile_> { }
export interface UpdateProfileRaw extends M.EType<typeof UpdateProfile_> { }
export const UpdateProfile = M.opaque<UpdateProfileRaw, UpdateProfile>()(UpdateProfile_)

const CreateProfile_ = M.make((F) => 
  F.interface({
    owner: F.uuid(),
    name: F.string(),
    avatar: F.string(),
  }, { name: 'CreateProfile' })
)

export interface CreateProfile extends M.AType<typeof CreateProfile_> { }
export interface CreateProfileRaw extends M.EType<typeof CreateProfile_> { }
export const CreateProfile = M.opaque<CreateProfileRaw, CreateProfile>()(CreateProfile_)