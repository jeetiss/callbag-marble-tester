import map from 'callbag-map'
import pipe from 'callbag-pipe'

import { listenable, pullable, willBe } from '../src'

test('listenable source just works', () =>
  pipe(
    listenable('-a-b-c-|'),
    willBe('-a-b-c-|'),
  ))

test('map listenable source', () =>
  pipe(
    listenable('-a-b-c-|', { a: 1, b: 2, c: 3 }),
    map(value => value + 1),
    willBe('-a-b-c-|', { a: 2, b: 3, c: 4 }),
  ))

test('pullable source just works', () =>
  pipe(
    pullable('-a-c-b-|'),
    willBe('-a-c-b-|'),
  ))
