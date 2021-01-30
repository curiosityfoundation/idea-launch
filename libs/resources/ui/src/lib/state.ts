import * as A from '@effect-ts/core/Array'
import { pipe } from '@effect-ts/core/Function'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import * as R from '@effect-ts/core/Record'

import { Resource } from '@idea-launch/resources/model'
import { eqString } from '@effect-ts/core/Equal'

export interface ResourcesTable {
  entries: R.Record<string, Resource>,
  ids: ReadonlyArray<string>,
}

export const initResourcesState: ResourcesTable = {
  entries: {},
  ids: [],
}

interface AddResources {
  type: 'AddResources',
  payload: ReadonlyArray<Resource>
}

interface RemoveResources {
  type: 'RemoveResources',
  payload: ReadonlyArray<string>
}

export const ResourceAction = makeADT('type')({
  AddResources: ofType<AddResources>(),
  RemoveResources: ofType<RemoveResources>(),
})

export type ResourceAction = ADTType<typeof ResourceAction>

export const resourcesReducer = ResourceAction.createReducer(initResourcesState)({
  AddResources: (a) => (s) => ({
    entries: pipe(
      a.payload,
      A.reduce(
        s.entries,
        (acc, r) =>
          pipe(
            acc,
            R.insertAt(r.id, r),
          )
      )
    ),
    ids: pipe(
      a.payload,
      A.map((r) => r.id),
      A.concat(s.ids),
      A.uniq(eqString),
    )
  }),
  RemoveResources: (a) => (s) => ({
    entries: pipe(
      a.payload,
      A.reduce(
        s.entries,
        (acc, id) =>
          pipe(
            acc,
            R.deleteAt(id),
          )
      )
    ),
    ids: pipe(
      s.ids,
      A.filter((id) =>
        !a.payload.includes(id)
      ),
    )
  })
})
