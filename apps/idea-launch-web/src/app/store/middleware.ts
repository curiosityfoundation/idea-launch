import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { Action } from 'redux'

import {
  makeReduxEpicMiddleware,
  ReduxQueueOf,
  makeReduxQueue,
  ReduxEffectMiddleware,
} from '@idea-launch/redux-effect'

import { AppAction, AppState } from './constants'
import { AppEpic } from './epics'

type AppEpic = typeof AppEpic

const ReduxQueue = ReduxQueueOf<AppEpic['_A'] | AppEpic['_O'], AppEpic['_S']>()

export const ReduxQueueLive = L.fromEffect(ReduxQueue)(makeReduxQueue)

export const ReduxEffectMiddlewareLive = L.fromEffect(ReduxEffectMiddleware)(
  makeReduxEpicMiddleware(AppEpic)(ReduxQueue)
)

export const accessReduxEffectMiddleware = T.accessService(ReduxEffectMiddleware)
export const accessReduxEffectMiddlewareM = T.accessServiceM(ReduxEffectMiddleware)
