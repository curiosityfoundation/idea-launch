import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'

import { makeEpicMiddleware, makeMiddleware } from '@idea-launch/redux-effect'

import { RouteEpic } from '../../router'
import { Action, State } from '../constants'
import { LoginEpic } from './auth'
import { FetchResourcesEpic } from './resources'
import { FetchProfileEpic } from './profile'

export const EpicMiddleware = makeEpicMiddleware<Action, State>()

export const accessEpicMiddleware = T.accessService(EpicMiddleware)
export const accessEpicMiddlewareM = T.accessServiceM(EpicMiddleware)

export const EpicMiddlewareLive = L.fromEffect(EpicMiddleware)(
  makeMiddleware([
    LoginEpic,
    RouteEpic,
    FetchResourcesEpic,
    FetchProfileEpic,
  ])
)
