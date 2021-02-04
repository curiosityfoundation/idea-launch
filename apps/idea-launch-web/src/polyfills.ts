/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'buffer'
import Buffer from 'buffer'
(window as any).Buffer = Buffer.Buffer as any
(window as any).Buffer.isBuffer = () => false
