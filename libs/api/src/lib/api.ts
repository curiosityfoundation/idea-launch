import * as M from '@effect-ts/morphic'
import * as T from '@effect-ts/core/Effect'
import { UUID } from '@effect-ts/morphic/Algebra/Primitives'
import { MorphADT, AOfTypes, AnyADTTypes } from '@effect-ts/morphic/Batteries/usage/tagged-union'

export interface Endpoint<
  T extends string,
  A extends M.M<any, any, any>,
  ResultRaw,
  O extends MorphADT<any, any, any, any, ResultRaw>,
  > {
  _O: ResultRaw
  name: T
  Body: A
  Response: O
}

const Empty_ = M.make((F) =>
  F.interface({})
)

export interface Empty extends M.AType<typeof Empty_> { }
export interface EmptyRaw extends M.EType<typeof Empty_> { }
export const Empty = M.opaque<EmptyRaw, Empty>()(Empty_)

export function endpoint<
  T extends string,
  A extends M.M<any, any, any>,
  ResultRaw,
  O extends MorphADT<any, any, any, any, ResultRaw>,
  >(
    opt: {
      name: T
      Body: A
      Response: O
    }
  ) {
  return opt as Endpoint<T, A, ResultRaw, O>
}

export function handler<E extends Endpoint<any, any, any, any>>(
  endpoint: E
): <R>(fn: (e: E) => T.RIO<R, E['_O']>) => Handler<R, E> {
  return <R>(fn: (e: E) => T.RIO<R, E['_O']>) => fn(endpoint)
}

export interface Handler<R, E extends Endpoint<any, any, any, any>> extends T.RIO<R, E['_O']> { }
