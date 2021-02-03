import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'

import {
  makeReduxEpicMiddleware,
  ReduxQueueOf,
  makeReduxQueue,
  ReduxEffectMiddleware,
  combineEffects,
  fromReduxEffect
} from '@idea-launch/redux-effect'

import { Action, State } from './constants'
import { AccountEffects } from './account'
import { APIEffects } from './api'
import { RouterEffects } from './router'

export const RootEffects = combineEffects([
  AccountEffects,
  APIEffects,
  RouterEffects,
])

const ReduxQueue = ReduxQueueOf<Action, State>()

export const ReduxQueueLive = L.fromEffect(ReduxQueue)(makeReduxQueue)

export const ReduxEffectMiddlewareLive = L.fromEffect(ReduxEffectMiddleware)(
  makeReduxEpicMiddleware(fromReduxEffect(RootEffects))(ReduxQueue)
)

export const accessReduxEffectMiddleware = T.accessService(ReduxEffectMiddleware)
export const accessReduxEffectMiddlewareM = T.accessServiceM(ReduxEffectMiddleware)
