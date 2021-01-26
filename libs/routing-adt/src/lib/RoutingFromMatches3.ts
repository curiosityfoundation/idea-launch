import * as R from 'fp-ts-routing';
import { makeADT, ADTType, ofType, ADT } from '@effect-ts/morphic/Adt';
export const routingFromMatches3 = <
  C,
  B,
  A,
  CKey extends string,
  BKey extends string,
  AKey extends string,
>(
  [cKey, cMatch]: [CKey, R.Match<C>],
  [bKey, bMatch]: [BKey, R.Match<B>],
  [aKey, aMatch]: [AKey, R.Match<A>],
): {
  parse: (path: string) => { type: 'NotFound' } | 
B & { type: BKey } | A & { type: AKey } | C & { type: CKey }
  format: (adt: { type: 'NotFound' } | 
B & { type: BKey } | A & { type: AKey } | C & { type: CKey }) => string;
  adt: ADT<{ type: 'NotFound' } | 
B & { type: BKey } | A & { type: AKey } | C & { type: CKey }, 'type'>
} => {
  const RouteAdt = makeADT('type')({
    NotFound: ofType(),
    [cKey]: ofType<C & { type: CKey }>(),
    [bKey]: ofType<B & { type: BKey }>(),
    [aKey]: ofType<A & { type: AKey }>(),
  });
  type RouteAdt = ADTType<typeof RouteAdt>
  const parser = R.zero<RouteAdt>()
    .alt(cMatch.parser.map(c => ({ type: cKey as CKey, ...c })))
    .alt(bMatch.parser.map(b => ({ type: bKey as BKey, ...b })))
    .alt(aMatch.parser.map(a => ({ type: aKey as AKey, ...a })))
  const SafeRouteAdt = RouteAdt as ADT<{ type: 'NotFound' } | 
{ type: BKey } | { type: AKey } | { type: CKey }, "type">
  const format = (
    adt: RouteAdt
  ): string => {
  if (SafeRouteAdt.is.NotFound(adt)) {
    return R.format(R.end.formatter, {});
  }
    if (SafeRouteAdt.is[bKey as BKey](adt)) {
      return R.format(bMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[aKey as AKey](adt)) {
      return R.format(aMatch.formatter, adt);
    }
    return R.format(cMatch.formatter, adt);
  }
  return {
    parse: (path: string) => R.parse(parser, R.Route.parse(path), { type: 'NotFound' }),
    format,
    adt: RouteAdt,
  };
};