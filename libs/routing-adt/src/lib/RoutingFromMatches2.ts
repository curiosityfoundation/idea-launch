import * as R from 'fp-ts-routing';
import { makeADT, ADTType, ofType, ADT } from '@effect-ts/morphic/Adt';
export const routingFromMatches2 = <
  B,
  A,
  BKey extends string,
  AKey extends string,
>(
  [bKey, bMatch]: [BKey, R.Match<B>],
  [aKey, aMatch]: [AKey, R.Match<A>],
): {
  parse: (path: string) => { type: 'NotFound' } | 
A & { type: AKey } | B & { type: BKey }
  format: (adt: { type: 'NotFound' } | 
A & { type: AKey } | B & { type: BKey }) => string;
  adt: ADT<{ type: 'NotFound' } | 
A & { type: AKey } | B & { type: BKey }, 'type'>
} => {
  const RouteAdt = makeADT('type')({
    NotFound: ofType(),
    [bKey]: ofType<B & { type: BKey }>(),
    [aKey]: ofType<A & { type: AKey }>(),
  });
  type RouteAdt = ADTType<typeof RouteAdt>
  const parser = R.zero<RouteAdt>()
    .alt(bMatch.parser.map(b => ({ type: bKey as BKey, ...b })))
    .alt(aMatch.parser.map(a => ({ type: aKey as AKey, ...a })))
  const SafeRouteAdt = RouteAdt as ADT<{ type: 'NotFound' } | 
{ type: AKey } | { type: BKey }, "type">
  const format = (
    adt: RouteAdt
  ): string => {
  if (SafeRouteAdt.is.NotFound(adt)) {
    return R.format(R.end.formatter, {});
  }
    if (SafeRouteAdt.is[aKey as AKey](adt)) {
      return R.format(aMatch.formatter, adt);
    }
    return R.format(bMatch.formatter, adt);
  }
  return {
    parse: (path: string) => R.parse(parser, R.Route.parse(path), { type: 'NotFound' }),
    format,
    adt: RouteAdt,
  };
};