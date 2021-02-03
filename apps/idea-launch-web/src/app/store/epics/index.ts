import { pipe } from '@effect-ts/core/Function'
import * as S from '@effect-ts/core/Effect/Stream'

import { AccountEpic } from '@idea-launch/accounts/ui'
import { combineEpics, reduxEpic } from '@idea-launch/redux-effect'
import { CreateProfile, FindProfile, ListResources } from '@idea-launch/api'

import { APIEpic } from '../../api'
import { RouterEpic } from '../../router'
import { AppAction } from '../constants'
import { AddEntriesEpic } from './add-entries'
import { FindProfileOnLoginEpic } from './find-profile-on-login'

export const AppEpic = combineEpics([
  APIEpic,
  RouterEpic,
  AccountEpic,
  AddEntriesEpic,
  FindProfileOnLoginEpic,
])
