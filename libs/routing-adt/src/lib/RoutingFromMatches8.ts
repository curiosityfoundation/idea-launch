import * as R from 'fp-ts-routing';
import { makeADT, ADTType, ofType, ADT } from '@effect-ts/morphic/Adt';
export const routingFromMatches8 = <
  H,
  G,
  F,
  E,
  D,
  C,
  B,
  A,
  HKey extends string,
  GKey extends string,
  FKey extends string,
  EKey extends string,
  DKey extends string,
  CKey extends string,
  BKey extends string,
  AKey extends string,
>(
  [hKey, hMatch]: [HKey, R.Match<H>],
  [gKey, gMatch]: [GKey, R.Match<G>],
  [fKey, fMatch]: [FKey, R.Match<F>],
  [eKey, eMatch]: [EKey, R.Match<E>],
  [dKey, dMatch]: [DKey, R.Match<D>],
  [cKey, cMatch]: [CKey, R.Match<C>],
  [bKey, bMatch]: [BKey, R.Match<B>],
  [aKey, aMatch]: [AKey, R.Match<A>],
): {
  parse: (path: string) => { type: 'NotFound' } | 
G & { type: GKey } | F & { type: FKey } | E & { type: EKey } | D & { type: DKey } | C & { type: CKey } | B & { type: BKey } | A & { type: AKey } | H & { type: HKey }
  format: (adt: { type: 'NotFound' } | 
G & { type: GKey } | F & { type: FKey } | E & { type: EKey } | D & { type: DKey } | C & { type: CKey } | B & { type: BKey } | A & { type: AKey } | H & { type: HKey }) => string;
  adt: ADT<{ type: 'NotFound' } | 
G & { type: GKey } | F & { type: FKey } | E & { type: EKey } | D & { type: DKey } | C & { type: CKey } | B & { type: BKey } | A & { type: AKey } | H & { type: HKey }, 'type'>
} => {
  const RouteAdt = makeADT('type')({
    NotFound: ofType(),
    [hKey]: ofType<H & { type: HKey }>(),
    [gKey]: ofType<G & { type: GKey }>(),
    [fKey]: ofType<F & { type: FKey }>(),
    [eKey]: ofType<E & { type: EKey }>(),
    [dKey]: ofType<D & { type: DKey }>(),
    [cKey]: ofType<C & { type: CKey }>(),
    [bKey]: ofType<B & { type: BKey }>(),
    [aKey]: ofType<A & { type: AKey }>(),
  });
  type RouteAdt = ADTType<typeof RouteAdt>
  const parser = R.zero<RouteAdt>()
    .alt(hMatch.parser.map(h => ({ type: hKey as HKey, ...h })))
    .alt(gMatch.parser.map(g => ({ type: gKey as GKey, ...g })))
    .alt(fMatch.parser.map(f => ({ type: fKey as FKey, ...f })))
    .alt(eMatch.parser.map(e => ({ type: eKey as EKey, ...e })))
    .alt(dMatch.parser.map(d => ({ type: dKey as DKey, ...d })))
    .alt(cMatch.parser.map(c => ({ type: cKey as CKey, ...c })))
    .alt(bMatch.parser.map(b => ({ type: bKey as BKey, ...b })))
    .alt(aMatch.parser.map(a => ({ type: aKey as AKey, ...a })))
  const SafeRouteAdt = RouteAdt as ADT<{ type: 'NotFound' } | 
{ type: GKey } | { type: FKey } | { type: EKey } | { type: DKey } | { type: CKey } | { type: BKey } | { type: AKey } | { type: HKey }, "type">
  const format = (
    adt: RouteAdt
  ): string => {
  if (SafeRouteAdt.is.NotFound(adt)) {
    return R.format(R.end.formatter, {});
  }
    if (SafeRouteAdt.is[gKey as GKey](adt)) {
      return R.format(gMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[fKey as FKey](adt)) {
      return R.format(fMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[eKey as EKey](adt)) {
      return R.format(eMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[dKey as DKey](adt)) {
      return R.format(dMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[cKey as CKey](adt)) {
      return R.format(cMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[bKey as BKey](adt)) {
      return R.format(bMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[aKey as AKey](adt)) {
      return R.format(aMatch.formatter, adt);
    }
    return R.format(hMatch.formatter, adt);
  }
  return {
    parse: (path: string) => R.parse(parser, R.Route.parse(path), { type: 'NotFound' }),
    format,
    adt: RouteAdt,
  };
};