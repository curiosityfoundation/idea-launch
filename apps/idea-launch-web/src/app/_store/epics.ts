import { AccountEpic } from '@idea-launch/accounts/ui'
import { combineEpics } from '@idea-launch/redux-effect'

import { APIEpic } from '../api'
import { RouterEpic } from '../router'

export const AppEpic = combineEpics([
  APIEpic,
  RouterEpic,
  AccountEpic,
])
