import { ADTType } from '@effect-ts/morphic/Adt'

import { Resource } from '@idea-launch/resources/model'
import { makeTable, Table } from '@idea-launch/redux-table'

export interface ResourceTable extends Table<Resource> { }

export const {
  Action: ResourceTableAction,
  initState: initResourceTableState,
  reducer: resourceTableReducer,
} = makeTable<Resource>()('resources')

export type ResourceTableAction = ADTType<typeof ResourceTableAction>
