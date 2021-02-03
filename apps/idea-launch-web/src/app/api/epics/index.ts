import { combineEpics } from '@idea-launch/redux-effect'
import { CreateProfileEffects } from './create-profile'
import { FindProfileEffects } from './find-profile'
import { ListResourcesEffects } from './list-resources'

export const APIEpic = combineEpics([
  CreateProfileEffects,
  FindProfileEffects,
  ListResourcesEffects,
])
