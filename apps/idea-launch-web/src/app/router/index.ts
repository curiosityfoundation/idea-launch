import * as R from 'fp-ts-routing'
import { ADTType } from '@effect-ts/morphic/Adt'
import * as t from 'io-ts'
import { Match, Parser, Formatter, Route as FptsRoute, QueryValues } from 'fp-ts-routing'
import { tuple } from 'fp-ts/lib/function'
import { fromEither, option } from 'fp-ts/lib/Option'

import { routingFromMatches5 } from '@idea-launch/routing-adt'
import { makeRouteState, RouteState as RouteState_ } from '@idea-launch/morphic-router'

import { query } from './query'

const landing = R.end
const login = R.lit('login').then(R.end)
const feed = R.lit('feed').then(R.end)
const contact = R.lit('contact').then(R.end)
const resources =
  R.lit('resources')
    .then(
      query(
        t.union([
          t.strict({ category: t.string }),
          t.undefined,
        ])
      )
    )
    .then(R.end)

export const {
  parse: decodeRoute,
  format: encodeRoute,
  adt: Route
} = routingFromMatches5(
  ['Landing', landing],
  ['Feed', feed],
  ['Contact', contact],
  ['Resources', resources],
  ['Login', login],
)

export type Route = ADTType<typeof Route>

export type RouteState = RouteState_<Route>

export const initRouteState: RouteState = {
  current: Route.of.Landing({})
}

export const {
  RouteAction,
  routeReducer,
  Redirect,
  RouteEpic,
  Router,
  Link
} = makeRouteState<Route>(
  initRouteState,
  encodeRoute,
  decodeRoute,
)

export type RouteAction = ADTType<typeof RouteAction>

