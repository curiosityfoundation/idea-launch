import * as T from '@effect-ts/core/Effect'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as Ref from '@effect-ts/core/Effect/Ref'
import { pipe } from '@effect-ts/core/Function'
import { tag } from '@effect-ts/core/Has'
import { Action, MiddlewareAPI, Dispatch, AnyAction } from 'redux'

export interface ReduxQueue<A extends Action, S> {
  middlewareApi: Ref.Ref<MiddlewareAPI<Dispatch<AnyAction>, S>>
  actions: Q.Queue<A>
}

export const ReduxQueueOf = <A extends Action = Action, S = any>() => tag<ReduxQueue<A, S>>()

export const makeReduxQueue = pipe(
  T.do,
  T.bind(
    'actions',
    () => Q.makeUnbounded<Action>(),
  ),
  T.bind(
    'middlewareApi',
    () => Ref.makeRef(null),
  ),
  T.map(
    ({ actions, middlewareApi }) => ({
      actions,
      middlewareApi,
    })
  )
)
