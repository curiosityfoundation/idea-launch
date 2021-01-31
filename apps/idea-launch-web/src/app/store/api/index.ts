import { combineEffects } from '@idea-launch/redux-effect';

import { FindProfileEffects } from './find-profile'
import { ListResourcesEffects } from './list-resources'

export const APIEffects = combineEffects([
  FindProfileEffects,
  ListResourcesEffects,
])
