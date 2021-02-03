import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'

import {
  makeReduxEpicMiddleware,
  ReduxQueueOf,
  makeReduxQueue,
  ReduxEffectMiddleware,
} from '@idea-launch/redux-effect'

import { AppAction, AppState } from './constants'
import { AppEpic } from './epics'

const ReduxQueue = ReduxQueueOf<AppAction, AppState>()

export const ReduxQueueLive = L.fromEffect(ReduxQueue)(makeReduxQueue)

export const ReduxEffectMiddlewareLive = L.fromEffect(ReduxEffectMiddleware)(
  makeReduxEpicMiddleware(AppEpic)(ReduxQueue)
)

export const accessReduxEffectMiddleware = T.accessService(ReduxEffectMiddleware)
export const accessReduxEffectMiddlewareM = T.accessServiceM(ReduxEffectMiddleware)
