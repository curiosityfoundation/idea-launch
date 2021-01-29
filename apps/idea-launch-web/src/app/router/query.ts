import * as t from 'io-ts'
import { Match, Parser, Formatter, Route, QueryValues } from 'fp-ts-routing'
import { tuple } from 'fp-ts/lib/function'
import { fromEither, option, some } from 'fp-ts/lib/Option'

export function query<A>(
  type: t.Type<A, Record<string, QueryValues>>
): Match<{ query?: Partial<A> }> {

  return new Match(
    new Parser((r) =>
      option.map(
        Object.keys(r.query).length === 0
          && r.query.constructor === Object
          ? some({})
          : fromEither(
            type.decode(r.query)
          ),
        (query) => tuple(
          { query },
          new Route(r.parts, {})
        )
      )
    ),
    new Formatter((r, query) =>
      new Route(
        r.parts,
        type.encode((query.query || {} as any))
      )
    )
  )
}
