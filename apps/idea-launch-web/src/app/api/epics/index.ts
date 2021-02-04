import { combineEpics } from '@idea-launch/redux-effect'
import { CreateProfileEpic } from './create-profile'
import { FindProfileEpic } from './find-profile'
import { ListResourcesEpic } from './list-resources'

export const APIEpic = combineEpics([
  CreateProfileEpic,
  FindProfileEpic,
  ListResourcesEpic,
])
