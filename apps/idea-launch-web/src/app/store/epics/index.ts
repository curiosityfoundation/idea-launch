import { AccountEpic } from '@idea-launch/accounts/ui'
import { combineEpics } from '@idea-launch/redux-effect'

import { APIEpic } from '../../api'
import { RouterEpic } from '../../router'
import { StorageEpic } from '../../storage'
import { AddEntriesEpic } from './add-entries'
import { FindProfileOnLoginEpic } from './find-profile-on-login'
import { FindResourcesOnLocationChange } from './find-resources-on-location-change'

export const AppEpic = combineEpics([
  APIEpic,
  RouterEpic,
  AccountEpic,
  AddEntriesEpic,
  FindProfileOnLoginEpic,
  FindResourcesOnLocationChange,
  StorageEpic,
])
