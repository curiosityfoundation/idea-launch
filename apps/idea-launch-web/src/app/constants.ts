import { combineReducers } from 'redux'

import { epic as epic_ } from '@idea-launch/redux-effect';

import { AccountState, AccountAction, accountReducer, initAccountState } from '@idea-launch/accounts/ui'

export interface State {
  account: AccountState
}

export const reducer = combineReducers<State>({
  account: accountReducer,
})

export const initState: State = {
  account: initAccountState
}

export const Action = AccountAction

export type Action = AccountAction

// import { unionADT, ADTType } from '@effect-ts/morphic/Adt'

// export const Action = unionADT([
//   AccountAction,
//   ...,
// ])

// export type Action = ADTType<typeof Action>

export const epic = epic_<Action, State>()
