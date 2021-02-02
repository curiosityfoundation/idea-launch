import * as Q from '@effect-ts/core/Effect/Queue'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { Has, Tag, tag } from '@effect-ts/core/Has'
import { Action, MiddlewareAPI, Dispatch, AnyAction } from 'redux'

export interface ActionWithState<A extends Action, S> {
  action: A
  state: S
}

export interface ReduxQueue<A extends Action, S> {
  middlewareApi: Ref.Ref<MiddlewareAPI<Dispatch<AnyAction>, S>>
  actionsWithState: Q.Queue<ActionWithState<A, S>>
}

export const ReduxQueueOf = <A extends Action, S>() => tag<ReduxQueue<A, S>>()
