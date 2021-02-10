import { ADTType } from '@effect-ts/morphic/Adt'

import { Comment, Project } from '@idea-launch/projects/model'
import { makeTable, Table } from '@idea-launch/redux-table'

export interface ProjectTable extends Table<Project> { }

export const {
  Action: ProjectTableAction,
  initState: initProjectTableState,
  reducer: projectTableReducer,
} = makeTable<Project>()('projects')

export type ProjectTableAction = ADTType<typeof ProjectTableAction>

export interface CommentTable extends Table<Comment> { }

export const {
  Action: CommentTableAction,
  initState: initCommentTableState,
  reducer: commentTableReducer,
} = makeTable<Comment>()('comments')

export type CommentTableAction = ADTType<typeof ProjectTableAction>
