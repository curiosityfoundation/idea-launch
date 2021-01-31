import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'

import {
  makeReduxEffectMiddleware,
  ReduxQueueOf,
  ActionWithState,
  ReduxEffectMiddleware,
  combineEffects,
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

export const ReduxQueueLive = L.fromEffect(ReduxQueue)(
  pipe(
    T.do,
    T.bind(
      'actionsWithState',
      () => Q.makeUnbounded<ActionWithState<Action, State>>(),
    ),
    T.bind(
      'middlewareApi',
      () => Ref.makeRef(null),
    ),
    T.map(
      ({ actionsWithState, middlewareApi }) => ({
        actionsWithState,
        middlewareApi
      })
    )
  )
)

export const ReduxEffectMiddlewareLive = L.fromEffect(ReduxEffectMiddleware)(
  makeReduxEffectMiddleware(RootEffects)(ReduxQueue)
)

export const accessReduxEffectMiddleware = T.accessService(ReduxEffectMiddleware)
export const accessReduxEffectMiddlewareM = T.accessServiceM(ReduxEffectMiddleware)
