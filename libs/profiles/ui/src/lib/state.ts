import { ADTType } from '@effect-ts/morphic/Adt'

import { Profile } from '@idea-launch/profiles/model'
import { makeTable, Table } from '@idea-launch/redux-table'

export interface ProfileTable extends Table<Profile> { }

export const {
  Action: ProfileTableAction,
  initState: initProfileTableState,
  reducer: profileTableReducer,
} = makeTable<Profile>()('profiles')

export type ProfileTableAction = ADTType<typeof ProfileTableAction>
