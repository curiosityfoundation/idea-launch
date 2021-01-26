import * as R from 'fp-ts-routing';
import { makeADT, ADTType, ofType, ADT } from '@effect-ts/morphic/Adt';
export const routingFromMatches16 = <
  P,
  O,
  N,
  M,
  L,
  K,
  J,
  I,
  H,
  G,
  F,
  E,
  D,
  C,
  B,
  A,
  PKey extends string,
  OKey extends string,
  NKey extends string,
  MKey extends string,
  LKey extends string,
  KKey extends string,
  JKey extends string,
  IKey extends string,
  HKey extends string,
  GKey extends string,
  FKey extends string,
  EKey extends string,
  DKey extends string,
  CKey extends string,
  BKey extends string,
  AKey extends string,
>(
  [pKey, pMatch]: [PKey, R.Match<P>],
  [oKey, oMatch]: [OKey, R.Match<O>],
  [nKey, nMatch]: [NKey, R.Match<N>],
  [mKey, mMatch]: [MKey, R.Match<M>],
  [lKey, lMatch]: [LKey, R.Match<L>],
  [kKey, kMatch]: [KKey, R.Match<K>],
  [jKey, jMatch]: [JKey, R.Match<J>],
  [iKey, iMatch]: [IKey, R.Match<I>],
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
O & { type: OKey } | N & { type: NKey } | M & { type: MKey } | L & { type: LKey } | K & { type: KKey } | J & { type: JKey } | I & { type: IKey } | H & { type: HKey } | G & { type: GKey } | F & { type: FKey } | E & { type: EKey } | D & { type: DKey } | C & { type: CKey } | B & { type: BKey } | A & { type: AKey } | P & { type: PKey }
  format: (adt: { type: 'NotFound' } | 
O & { type: OKey } | N & { type: NKey } | M & { type: MKey } | L & { type: LKey } | K & { type: KKey } | J & { type: JKey } | I & { type: IKey } | H & { type: HKey } | G & { type: GKey } | F & { type: FKey } | E & { type: EKey } | D & { type: DKey } | C & { type: CKey } | B & { type: BKey } | A & { type: AKey } | P & { type: PKey }) => string;
  adt: ADT<{ type: 'NotFound' } | 
O & { type: OKey } | N & { type: NKey } | M & { type: MKey } | L & { type: LKey } | K & { type: KKey } | J & { type: JKey } | I & { type: IKey } | H & { type: HKey } | G & { type: GKey } | F & { type: FKey } | E & { type: EKey } | D & { type: DKey } | C & { type: CKey } | B & { type: BKey } | A & { type: AKey } | P & { type: PKey }, 'type'>
} => {
  const RouteAdt = makeADT('type')({
    NotFound: ofType(),
    [pKey]: ofType<P & { type: PKey }>(),
    [oKey]: ofType<O & { type: OKey }>(),
    [nKey]: ofType<N & { type: NKey }>(),
    [mKey]: ofType<M & { type: MKey }>(),
    [lKey]: ofType<L & { type: LKey }>(),
    [kKey]: ofType<K & { type: KKey }>(),
    [jKey]: ofType<J & { type: JKey }>(),
    [iKey]: ofType<I & { type: IKey }>(),
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
    .alt(pMatch.parser.map(p => ({ type: pKey as PKey, ...p })))
    .alt(oMatch.parser.map(o => ({ type: oKey as OKey, ...o })))
    .alt(nMatch.parser.map(n => ({ type: nKey as NKey, ...n })))
    .alt(mMatch.parser.map(m => ({ type: mKey as MKey, ...m })))
    .alt(lMatch.parser.map(l => ({ type: lKey as LKey, ...l })))
    .alt(kMatch.parser.map(k => ({ type: kKey as KKey, ...k })))
    .alt(jMatch.parser.map(j => ({ type: jKey as JKey, ...j })))
    .alt(iMatch.parser.map(i => ({ type: iKey as IKey, ...i })))
    .alt(hMatch.parser.map(h => ({ type: hKey as HKey, ...h })))
    .alt(gMatch.parser.map(g => ({ type: gKey as GKey, ...g })))
    .alt(fMatch.parser.map(f => ({ type: fKey as FKey, ...f })))
    .alt(eMatch.parser.map(e => ({ type: eKey as EKey, ...e })))
    .alt(dMatch.parser.map(d => ({ type: dKey as DKey, ...d })))
    .alt(cMatch.parser.map(c => ({ type: cKey as CKey, ...c })))
    .alt(bMatch.parser.map(b => ({ type: bKey as BKey, ...b })))
    .alt(aMatch.parser.map(a => ({ type: aKey as AKey, ...a })))
  const SafeRouteAdt = RouteAdt as ADT<{ type: 'NotFound' } | 
{ type: OKey } | { type: NKey } | { type: MKey } | { type: LKey } | { type: KKey } | { type: JKey } | { type: IKey } | { type: HKey } | { type: GKey } | { type: FKey } | { type: EKey } | { type: DKey } | { type: CKey } | { type: BKey } | { type: AKey } | { type: PKey }, "type">
  const format = (
    adt: RouteAdt
  ): string => {
  if (SafeRouteAdt.is.NotFound(adt)) {
    return R.format(R.end.formatter, {});
  }
    if (SafeRouteAdt.is[oKey as OKey](adt)) {
      return R.format(oMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[nKey as NKey](adt)) {
      return R.format(nMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[mKey as MKey](adt)) {
      return R.format(mMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[lKey as LKey](adt)) {
      return R.format(lMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[kKey as KKey](adt)) {
      return R.format(kMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[jKey as JKey](adt)) {
      return R.format(jMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[iKey as IKey](adt)) {
      return R.format(iMatch.formatter, adt);
    }
    if (SafeRouteAdt.is[hKey as HKey](adt)) {
      return R.format(hMatch.formatter, adt);
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
    return R.format(pMatch.formatter, adt);
  }
  return {
    parse: (path: string) => R.parse(parser, R.Route.parse(path), { type: 'NotFound' }),
    format,
    adt: RouteAdt,
  };
};