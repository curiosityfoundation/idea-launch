import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'

import { Route } from './route'

interface PushLocation {
  type: 'PushLocation'
  payload: Route
}

interface PopLocation {
  type: 'PopLocation'
  payload: Route
}

interface LocationChanged {
  type: 'LocationChanged'
  payload: Route
}

export const RouteAction = makeADT('type')({
  PopLocation: ofType<PopLocation>(),
  PushLocation: ofType<PushLocation>(),
  LocationChanged: ofType<LocationChanged>(),
})

export type RouteAction = ADTType<typeof RouteAction>

export interface RouteState {
  current: Route
}

export const initRouteState: RouteState = {
  current: Route.of.Landing({})
}

export const routeReducer = RouteAction.createReducer(initRouteState)({
  PushLocation: () => (s) => s,
  PopLocation: () => (s) => s,
  LocationChanged: (a) => () => ({
    current: a.payload
  }),
})
