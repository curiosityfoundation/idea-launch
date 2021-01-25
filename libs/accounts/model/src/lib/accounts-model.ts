import * as M from '@effect-ts/morphic'

const Authorized_ = M.make((F) => 
  F.interface({
    userId: F.uuid(),
    idToken: F.string(),
  }, { name: 'Authorized' })
)

export interface Authorized extends M.AType<typeof Authorized_> { }
export interface AuthorizedRaw extends M.EType<typeof Authorized_> { }
export const Authorized = M.opaque<AuthorizedRaw, Authorized>()(Authorized_)
