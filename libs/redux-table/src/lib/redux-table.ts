import * as A from '@effect-ts/core/Array'
import { eqString } from '@effect-ts/core/Equal'
import { pipe } from '@effect-ts/core/Function'
import * as R from '@effect-ts/core/Record'
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { Reducer } from '@effect-ts/morphic/Adt/matcher'

export interface Table<A> {
  entries: R.Record<string, A>,
  ids: ReadonlyArray<string>,
}

export function makeTable<A extends { id: string }>() {
  return function <T extends string>(name: T) {

    const initState: Table<A> = {
      entries: {},
      ids: [],
    }

    interface AddEntries {
      type: 'AddEntries',
      payload: {
        table: T
        entries: ReadonlyArray<A>
      }
    }

    interface RemoveEntries {
      type: 'RemoveEntries',
      payload: {
        table: T
        ids: ReadonlyArray<string>
      }
    }

    interface ClearEntries {
      type: 'ClearEntries',
      payload: {
        table: T
      }
    }

    const Action = makeADT('type')({
      AddEntries: ofType<AddEntries>(),
      RemoveEntries: ofType<RemoveEntries>(),
      ClearEntries: ofType<ClearEntries>(),
    })

    type Action = ADTType<typeof Action>

    const filterReducer = (r: Reducer<Table<A>, Action>): Reducer<Table<A>, Action> =>
      (s, a) => Action.verified(a)
        && a.payload.table === name
        ? r(s, a)
        : !!s
          ? s
          : initState

    const reducer = filterReducer(
      Action.createReducer(initState)({
        AddEntries: (a) => (s) => ({
          entries: pipe(
            a.payload.entries,
            A.reduce(
              s.entries,
              (acc, e) =>
                pipe(
                  acc,
                  R.insertAt(e.id, e),
                )
            )
          ),
          ids: pipe(
            a.payload.entries,
            A.map((r) => r.id),
            A.concat(s.ids),
            A.uniq(eqString),
          )
        }),
        RemoveEntries: (a) => (s) => ({
          entries: pipe(
            a.payload.ids,
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
              !a.payload.ids.includes(id)
            ),
          )
        }),
        ClearEntries: () => () => initState
      })
    )

    return { Action, initState, reducer }

  }
}
