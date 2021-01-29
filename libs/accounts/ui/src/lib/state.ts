import * as M from '@effect-ts/morphic'
import * as O from '@effect-ts/core/Option'

import { Authorized } from '@idea-launch/accounts/model'

const LoggedOut_ = M.make((F) =>
  F.interface({
    state: F.stringLiteral('LoggedOut'),
    reason: F.option(F.string())
  }, { name: 'LoggedOut' })
)

export interface LoggedOut extends M.AType<typeof LoggedOut_> { }
export interface LoggedOutRaw extends M.EType<typeof LoggedOut_> { }
export const LoggedOut = M.opaque<LoggedOutRaw, LoggedOut>()(LoggedOut_)

const LoggingIn_ = M.make((F) => 
  F.interface({
    state: F.stringLiteral('LoggingIn')
  }, { name: 'LoggingIn' })
)

export interface LoggingIn extends M.AType<typeof LoggingIn_> { }
export interface LoggingInRaw extends M.EType<typeof LoggingIn_> { }
export const LoggingIn = M.opaque<LoggingInRaw, LoggingIn>()(LoggingIn_)

const LoggedIn_ = M.make((F) =>
  F.intersection(
    Authorized(F),
    F.interface({
      state: F.stringLiteral('LoggedIn'),
    })
  )({ name: 'LoggedIn' })
)

export interface LoggedIn extends M.AType<typeof LoggedIn_> { }
export interface LoggedInRaw extends M.EType<typeof LoggedIn_> { }
export const LoggedIn = M.opaque<LoggedInRaw, LoggedIn>()(LoggedIn_)

const LoggingOut_ = M.make((F) => 
  F.interface({
    state: F.stringLiteral('LoggingOut')
  }, { name: 'LoggingOut' })
)

export interface LoggingOut extends M.AType<typeof LoggingOut_> { }
export interface LoggingOutRaw extends M.EType<typeof LoggingOut_> { }
export const LoggingOut = M.opaque<LoggingOutRaw, LoggingOut>()(LoggingOut_)

export const AccountState = M.makeADT('state')({
  LoggedIn,
  LoggedOut,
  LoggingIn,
  LoggingOut,
})

export type AccountState = M.AType<typeof AccountState>

export const initAccountState = AccountState.of.LoggedOut({ reason: O.none })

const LoginStarted_ = M.make((F) => 
  F.interface({
    type: F.stringLiteral('LoginStarted'),
  }, { name: 'LoginStarted' })
)

export interface LoginStarted extends M.AType<typeof LoginStarted_> { }
export interface LoginStartedRaw extends M.EType<typeof LoginStarted_> { }
export const LoginStarted = M.opaque<LoginStartedRaw, LoginStarted>()(LoginStarted_)

const LoginSuccess_ = M.make((F) =>
  F.interface({
    type: F.stringLiteral('LoginSuccess'),
    payload: Authorized(F)
  }, { name: 'LoginSuccess' })
)

export interface LoginSuccess extends M.AType<typeof LoginSuccess_> { }
export interface LoginSuccessRaw extends M.EType<typeof LoginSuccess_> { }
export const LoginSuccess = M.opaque<LoginSuccessRaw, LoginSuccess>()(LoginSuccess_)

const LoginFailure_ = M.make((F) =>
  F.interface({
    type: F.stringLiteral('LoginFailure'),
    payload: F.string(),
  }, { name: 'LoginFailure' })
)

export interface LoginFailure extends M.AType<typeof LoginFailure_> { }
export interface LoginFailureRaw extends M.EType<typeof LoginFailure_> { }
export const LoginFailure = M.opaque<LoginFailureRaw, LoginFailure>()(LoginFailure_)

const LogoutStarted_ = M.make((F) => 
  F.interface({
    type: F.stringLiteral('LogoutStarted')
  }, { name: 'LogoutStarted' })
)

export interface LogoutStarted extends M.AType<typeof LogoutStarted_> { }
export interface LogoutStartedRaw extends M.EType<typeof LogoutStarted_> { }
export const LogoutStarted = M.opaque<LogoutStartedRaw, LogoutStarted>()(LogoutStarted_)

const LogoutSuccess_ = M.make((F) =>
  F.interface({
    type: F.stringLiteral('LogoutSuccess'),
  }, { name: 'LogoutSuccess' })
)

export interface LogoutSuccess extends M.AType<typeof LogoutSuccess_> { }
export interface LogoutSuccessRaw extends M.EType<typeof LogoutSuccess_> { }
export const LogoutSuccess = M.opaque<LogoutSuccessRaw, LogoutSuccess>()(LogoutSuccess_)

export const AccountAction = M.makeADT('type')({
  LoginStarted,
  LogoutStarted,
  LoginSuccess,
  LoginFailure,
  LogoutSuccess,
})

export type AccountAction = M.AType<typeof AccountAction>

export const accountReducer = AccountAction.createReducer(initAccountState)({
  LoginStarted: () => AccountState.transform({
    LoggedOut: () => AccountState.of.LoggingIn({}),
  }),
  LogoutStarted: () => AccountState.transform({
    LoggedIn: () => AccountState.of.LoggingOut({}),
  }),
  LoginSuccess: (a) => AccountState.transform({
    LoggedOut: () => AccountState.of.LoggedIn(a.payload),
    LoggingIn: () => AccountState.of.LoggedIn(a.payload),
    LoggedIn: () => AccountState.of.LoggedIn(a.payload),
  }),
  LoginFailure: (a) => AccountState.transform({
    LoggingIn: () => AccountState.of.LoggedOut({
      reason: O.some(a.payload)
    })
  }),
  LogoutSuccess: (a) => AccountState.transform({
    LoggedIn: () => AccountState.of.LoggedOut({
      reason: O.none
    })
  }),
})
