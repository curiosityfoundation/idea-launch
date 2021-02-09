import { combineEpics } from '@idea-launch/redux-effect'
import { CreateProfileEpic } from './create-profile'
import { FindProfileEpic } from './find-profile'
import { ListResourcesEpic } from './list-resources'
import { CreateProjectEpic } from './create-project'

export const APIEpic = combineEpics([
  CreateProfileEpic,
  CreateProjectEpic,
  FindProfileEpic,
  ListResourcesEpic,
])
