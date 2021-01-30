import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { makeADT, ofType, ADTType, unionADT } from '@effect-ts/morphic/Adt'
import { Reducer } from '@effect-ts/morphic/Adt/matcher'
import * as O from '@effect-ts/core/Option'

import { Endpoint } from './api'
import { ListProjects } from './list-projects'
import { ListResources } from './list-resources'

interface APIRequested<T, B> {
  type: 'APIRequested',
  payload: {
    endpoint: T
    body: B
  }
}

interface APIRequestStarted<T> {
  type: 'APIRequestStarted'
  payload: {
    endpoint: T
  }
}

interface APIRequestFailed<T> {
  type: 'APIRequestFailed'
  payload: {
    endpoint: T
    reason: string
  }
}

interface APIRequestSucceeded<T, A> {
  type: 'APIRequestSucceeded'
  payload: {
    endpoint: T
    response: A
  }
}

interface Init {
  state: 'Init'
}

interface Pending {
  state: 'Pending'
}

interface Failure {
  state: 'Failure'
  reason: string
  refreshing: boolean
}

interface Success<O> {
  state: 'Success'
  response: O
  refreshing: boolean
}

interface Both<O> {
  state: 'Both'
  response: O
  reason: string
  refreshing: boolean
}

export function remoteAccess<E extends Endpoint<any, any, any, any, any, any>>(
  endpoint: E
) {
  
  const State = makeADT('state')({
    Init: ofType<Init>(),
    Pending: ofType<Pending>(),
    Failure: ofType<Failure>(),
    Success: ofType<Success<E['_O']>>(),
    Both: ofType<Both<E['_O']>>(),
  })

  const initState = State.of.Init({})

  const Action = makeADT('type')({
    APIRequested: ofType<APIRequested<E['_T'], E['_A']>>(),
    APIRequestStarted: ofType<APIRequestStarted<E['_T']>>(),
    APIRequestFailed: ofType<APIRequestFailed<E['_T']>>(),
    APIRequestSucceeded: ofType<APIRequestSucceeded<E['_T'], E['_O']>>(),
  })

  type Action = ADTType<typeof Action>

  const filterReducer = <S>(r: Reducer<S, Action>): Reducer<S, Action> =>
    (s, a) => a.payload.endpoint === endpoint.name
      ? r(s, a)
      : s

  const reducer = pipe(
    Action.createReducer(initState)({
      APIRequested: () => (s) => s,
      APIRequestStarted: () =>
        State.transform({
          Init: () =>
            State.of.Pending({}),
          Failure: (s) =>
            State.of.Failure({
              ...s,
              refreshing: true
            }),
          Success: (s) =>
            State.of.Success({
              ...s,
              refreshing: true
            }),
          Both: (s) =>
            State.of.Both({
              ...s,
              refreshing: true
            }),
        }),
      APIRequestFailed: (a) =>
        State.transform({
          Pending: () =>
            State.of.Failure({
              reason: a.payload.reason,
              refreshing: false
            }),
          Failure: (s) => s.refreshing
            ? State.of.Failure({
              reason: a.payload.reason,
              refreshing: false
            })
            : s,
          Success: (s) => s.refreshing
            ? State.of.Both({
              ...s,
              reason: a.payload.reason,
              refreshing: false
            })
            : s,
          Both: (s) => s.refreshing
            ? State.of.Both({
              ...s,
              reason: a.payload.reason,
              refreshing: false
            })
            : s,
        }),
      APIRequestSucceeded: (a) =>
        State.transform({
          Pending: () =>
            State.of.Success({
              response: a.payload,
              refreshing: false
            }),
          Failure: (s) => s.refreshing
            ? State.of.Success({
              response: a.payload,
              refreshing: false
            })
            : s,
          Success: (s) => s.refreshing
            ? State.of.Success({
              response: a.payload,
              refreshing: false
            })
            : s,
          Both: (s) => s.refreshing
            ? State.of.Success({
              ...s,
              response: a.payload,
              refreshing: false
            })
            : s,
        }),
    }),
    filterReducer,
  )

  return { State, Action, reducer }

}

const {
  State: ListProjectsState,
  Action: ListProjectsAction,
  reducer: listProjectsReducer,
} = remoteAccess(ListProjects)

const {
  State: ListResourcesState,
  Action: ListResourcesAction,
  reducer: listResourcesReducer,
} = remoteAccess(ListResources)

const Action = unionADT([
  ListResourcesAction,
  ListProjectsAction,
])

const a = Action.of.APIRequested({
  payload: {
    endpoint: 'ListResources',
    body: { page: 2 }
  }
})
