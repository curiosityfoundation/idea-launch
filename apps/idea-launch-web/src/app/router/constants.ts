import * as R from 'fp-ts-routing'
import { ADT, ADTType } from '@effect-ts/morphic/Adt'
import { ExtractUnion } from '@effect-ts/morphic/Adt/utils'
import * as t from 'io-ts'

import { routingFromMatches7 } from '@idea-launch/routing-adt'
import { makeRouteState, RouteState as RouteState_ } from '@idea-launch/morphic-router'

import { query } from './query'

const landing = R.end

const login = R.lit('login').then(R.end)

const feed = R.lit('feed').then(R.end)

const contact = R.lit('contact').then(R.end)

const getStarted =
  R.lit('get-started')
    .then(
      R.type(
        'step',
        t.union([
          t.literal('1'),
          t.literal('2'),
        ])
      )
    ).then(R.end)

const welcome = R.lit('welcome').then(R.end)

const resources =
  R.lit('resources')
    .then(
      query(
        t.strict({ category: t.string }),
      )
    )
    .then(R.end)


export const {
  parse: decodeRoute,
  format: encodeRoute,
  adt: Route
} = routingFromMatches7(
  ['Landing', landing],
  ['Contact', contact],
  ['Resources', resources],
  ['Login', login],
  ['GetStarted', getStarted],
  ['Feed', feed],
  ['Welcome', welcome],
)

export type Route = ADTType<typeof Route>

export type RouteProps<T extends Route['type']> = ExtractUnion<Route, 'type', T>

export type RouteState = RouteState_<Route>

export const initRouteState: RouteState = {
  current: Route.of.Landing({})
}

export const {
  RouteAction,
  routeReducer,
  Redirect,
  Router,
  Link
} = makeRouteState<Route>(
  initRouteState,
  encodeRoute,
  decodeRoute,
)

export type RouteAction = ADTType<typeof RouteAction>

