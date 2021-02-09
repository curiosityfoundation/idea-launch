import { ADTType } from '@effect-ts/morphic/Adt'

import { Project } from '@idea-launch/projects/model'
import { makeTable, Table } from '@idea-launch/redux-table'

export interface ProjectTable extends Table<Project> { }

export const {
  Action: ProjectTableAction,
  initState: initProjectTableState,
  reducer: projectTableReducer,
} = makeTable<Project>()('projects')

export type ProjectTableAction = ADTType<typeof ProjectTableAction>
