import * as M from '@effect-ts/morphic'
import * as T from '@effect-ts/core/Effect'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'
import { MorphADT, AOfTypes, AnyADTTypes } from '@effect-ts/morphic/Batteries/usage/tagged-union'

export interface Endpoint<
  T extends string,
  R,
  Args extends M.M<any, any, any>,
  X extends AnyADTTypes,
  E,
  Result extends MorphADT<X, any, any, any, any>
  > {
  _R: R
  _A: M.AType<Args>
  _O: AOfTypes<X>
  name: T
  args: Args
  result: Result
  handler: (data: unknown, uid: UUID) =>
    T.Effect<R, E, AOfTypes<X>>
}

export type ResultType<E extends Endpoint<string, unknown, any, any, unknown, unknown>> = E['_O']
export type ArgsType<E extends Endpoint<string, unknown, any, any, unknown, unknown>> = E['_A']

const NoArgs_ = M.make((F) =>
  F.interface({}, { name: 'NoArgs' })
)

export interface NoArgs extends M.AType<typeof NoArgs_> { }
export interface NoArgsRaw extends M.EType<typeof NoArgs_> { }
export const NoArgs = M.opaque<NoArgsRaw, NoArgs>()(NoArgs_)

export function endpoint<
  T extends string,
  R,
  Args extends M.M<any, any, any>,
  X extends AnyADTTypes,
  E,
  Result extends MorphADT<X, any, any, any, any>
>(
  opt: {
    name: T
    args: Args
    result: Result
    handler: (data: unknown, uid: UUID) =>
      T.Effect<R, E, AOfTypes<X>>
  }
) {
  return opt as Endpoint<T, R, Args, X, E, Result>
}
