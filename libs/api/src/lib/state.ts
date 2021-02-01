import { pipe } from '@effect-ts/core/Function'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { Reducer } from '@effect-ts/morphic/Adt/matcher'

import { AnyEndpoint } from './api'

interface APIRequested<T, B> {
  type: 'APIRequested',
  payload: {
    endpoint: T
    body: B
  }
}

interface APIRequestStarted<T, B> {
  type: 'APIRequestStarted'
  payload: {
    endpoint: T
    body: B
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

export function makeRemoteAccess<E extends AnyEndpoint>(
  endpoint: E
) {

  const State = makeADT('state')({
    Init: ofType<Init>(),
    Pending: ofType<Pending>(),
    Failure: ofType<Failure>(),
    Success: ofType<Success<E['_RespA']>>(),
    Both: ofType<Both<E['_RespA']>>(),
  })

  type State = ADTType<typeof State>

  const initState = State.of.Init({})

  const Action = makeADT('type')({
    APIRequested: ofType<APIRequested<E['_T'], E['_BodyA']>>(),
    APIRequestStarted: ofType<APIRequestStarted<E['_T'], E['_BodyA']>>(),
    APIRequestFailed: ofType<APIRequestFailed<E['_T']>>(),
    APIRequestSucceeded: ofType<APIRequestSucceeded<E['_T'], E['_RespA']>>(),
  })

  type Action = ADTType<typeof Action>

  const pred = Action.isAnyOf([
    'APIRequestFailed',
    'APIRequestStarted',
    'APIRequestFailed',
    'APIRequestSucceeded',
  ])

  const filterReducer = (r: Reducer<State, Action>): Reducer<State, Action> =>
    (s, a) => pred(a)
      && a.payload.endpoint === endpoint.name
      ? r(s, a)
      : !!s
        ? s
        : initState

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
              response: a.payload.response,
              refreshing: false
            }),
          Failure: (s) => s.refreshing
            ? State.of.Success({
              response: a.payload.response,
              refreshing: false
            })
            : s,
          Success: (s) => s.refreshing
            ? State.of.Success({
              response: a.payload.response,
              refreshing: false
            })
            : s,
          Both: (s) => s.refreshing
            ? State.of.Success({
              ...s,
              response: a.payload.response,
              refreshing: false
            })
            : s,
        }),
    }),
    filterReducer,
  )

  return { State, Action, initState, reducer }

}