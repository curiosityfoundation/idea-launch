import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'

import { Route } from './route'

interface LocationChanged {
  type: 'LocationChanged'
  payload: Route
}

export const RouteAction = makeADT('type')({
  LocationChanged: ofType<LocationChanged>()
})

export type RouteAction = ADTType<typeof RouteAction>

export interface RouteState {
  current: Route
}

export const initRouteState: RouteState = {
  current: Route.of.Landing({})
}

export const routeReducer = RouteAction.createReducer(initRouteState)({
  LocationChanged: (a) => () => ({
    current: a.payload
  })
})
