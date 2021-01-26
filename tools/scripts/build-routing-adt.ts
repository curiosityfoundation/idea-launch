import * as A from '@effect-ts/core/Array';
import * as fs from 'fs';
import * as path from 'path';

const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const lowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const M = (() => {

  interface Monoid<A> {
    concat: (r: A, l: A) => A,
    empty: A,
  }

  const monoidString: Monoid<string> = {
    concat: (r: string, l: string) => l.concat(r),
    empty: '',
  }

  const fold = <A>(M: Monoid<A>) =>
    (as: ReadonlyArray<A>) => as.reduce(M.concat, M.empty)

  return { monoidString, fold }

})()

const alphabetIndex = (
  index: number,
  alphabet: string[],
) => M.fold(M.monoidString)(
  A.range(0, Math.floor(index / 26))
    .map(() => alphabet[index % 26])
);

export const codegenWithNumRoutes = (numRoutes: number): string => {
  if (numRoutes <= 0) return 'numRoutes must be higher than 0'
  const forEachRoute = (
    indexToString: (index: number) => string,
    separator?: string,
    finalRouteIndex = numRoutes - 1,
  ) => M.fold(M.monoidString)(
    A.range(0, separator !== undefined
      ? finalRouteIndex - 1
      : finalRouteIndex
    )
      .map(index => indexToString(index) + (
        separator != null
          ? separator
          : ''
      ))
  ) + (
      separator != null
        ? indexToString(finalRouteIndex)
        : ''
    );

  const adtType = '{ type: \'NotFound\' } | \n'
    + forEachRoute(
      (index) => `${alphabetIndex(index, uppercase)} & { type: ${alphabetIndex(index, uppercase)}Key }`,
      ' | ',
    );
  const safeAdtType = '{ type: \'NotFound\' } | \n'
    + forEachRoute(
      (index) => `{ type: ${alphabetIndex(index, uppercase)}Key }`,
      ' | ',
    );

  const matchTypes = forEachRoute((index) => `  ${alphabetIndex(index, uppercase)},\n`);
  const keyTypes = forEachRoute((index) => `  ${alphabetIndex(index, uppercase)}Key extends string,\n`);
  const tupleParams = forEachRoute(
    (index) => `  [${alphabetIndex(index, lowercase)}Key, ${alphabetIndex(index, lowercase)}Match]: [${alphabetIndex(index, uppercase)}Key, R.Match<${alphabetIndex(index, uppercase)}>],\n`
  );
  const adtKeyVals = forEachRoute(
    (index) => `    [${alphabetIndex(index, lowercase)}Key]: ofType<${alphabetIndex(index, uppercase)} & { type: ${alphabetIndex(index, uppercase)}Key }>(),\n`
  );
  const parserAlts = forEachRoute(
    (index) => `    .alt(${alphabetIndex(index, lowercase)}Match.parser.map(${alphabetIndex(index, lowercase)} => ({ type: ${alphabetIndex(index, lowercase)}Key as ${alphabetIndex(index, uppercase)}Key, ...${alphabetIndex(index, lowercase)} })))\n`
  );
  const formatterPredicates = forEachRoute(
    (index) => `    if (SafeRouteAdt.is[${alphabetIndex(index, lowercase)}Key as ${alphabetIndex(index, uppercase)}Key](adt)) {\n`
      + `      return R.format(${alphabetIndex(index, lowercase)}Match.formatter, adt);\n`
      + '    }\n',
    undefined,
    numRoutes - 2,
  ) + `    return R.format(${alphabetIndex(numRoutes - 1, lowercase)}Match.formatter, adt);\n`;
  return 'import * as R from \'fp-ts-routing\';\n'
    + 'import { makeADT, ADTType, ofType, ADT } from \'@effect-ts/morphic/Adt\';\n'
    + `export const routingFromMatches${numRoutes} = <\n`
    + matchTypes
    + keyTypes
    + '>(\n'
    + tupleParams
    + '): {\n'
    + `  parse: (path: string) => ${adtType}\n`
    + `  format: (adt: ${adtType}) => string;\n`
    + `  adt: ADT<${adtType}, 'type'>\n`
    + '} => {\n'
    + '  const RouteAdt = makeADT(\'type\')({\n'
    + '    NotFound: ofType(),\n'
    + adtKeyVals
    + '  });\n'
    + '  type RouteAdt = ADTType<typeof RouteAdt>\n'
    + '  const parser = R.zero<RouteAdt>()\n'
    + parserAlts
    + `  const SafeRouteAdt = RouteAdt as ADT<${safeAdtType}, "type">\n`
    + '  const format = (\n'
    + '    adt: RouteAdt\n'
    + '  ): string => {\n'
    + '  if (SafeRouteAdt.is.NotFound(adt)) {\n'
    + '    return R.format(R.end.formatter, {});\n'
    + '  }\n'
    + formatterPredicates
    + '  }\n'
    + '  return {\n'
    + '    parse: (path: string) => R.parse(parser, R.Route.parse(path), { type: \'NotFound\' }),\n'
    + '    format,\n'
    + '    adt: RouteAdt,\n'
    + '  };\n'
    + '};';
};

const indexFileWithNumFiles = (
  firstFileNum: number,
  lastFileNum: number,
) => {
  const forEachRoute = (
    indexToString: (routeIndex: number) => string,
  ) => M.fold(M.monoidString)(
    A.range(firstFileNum, lastFileNum - 1)
      .map(indexToString)
  )
  return forEachRoute(
    index => `import { routingFromMatches${index} } from './lib/RoutingFromMatches${index}';\n`
  ) + '\n'
    + `export {\n`
    + forEachRoute(index => `  routingFromMatches${index},\n`)
    + '};\n';
};

const firstFile = 1
const lastFile = 16

const ROOT_PATH = path.resolve(__dirname + '/../..')
const libPath = `${ROOT_PATH}/libs/routing-adt`

A.range(firstFile, lastFile).forEach(numRoutes => {
  fs.writeFile(
    `${libPath}/src/lib/RoutingFromMatches${numRoutes}.ts`,
    codegenWithNumRoutes(numRoutes),
    (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log(`RoutingFromMatches${numRoutes}.ts`);
    }
  );
})
fs.writeFile(
  `${libPath}/src/index.ts`,
  indexFileWithNumFiles(firstFile, lastFile),
  (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Index File saved!');
  }
);
