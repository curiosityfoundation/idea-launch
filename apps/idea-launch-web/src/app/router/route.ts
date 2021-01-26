import * as R from 'fp-ts-routing'
import { ADTType } from '@effect-ts/morphic/Adt'

import { routingFromMatches5 } from '@idea-launch/routing-adt'

const landing = R.end
const login = R.lit('login').then(R.end)
const feed = R.lit('feed').then(R.end)
const contact = R.lit('contact').then(R.end)
const resources = R.lit('resources').then(R.end)

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
