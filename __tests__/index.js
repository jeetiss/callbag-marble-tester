import map from 'callbag-map'
import pipe from 'callbag-pipe'

import { listenable, pullable, willBe } from '../src'

test('listenable source just works', () =>
  pipe(
    listenable('-a-b-c-|'),
    willBe('    -a-b-c-|'),
  ))

test('map listenable source', () =>
  pipe(
    listenable('-a-b-c-|', { a: 0, b: 1, c: 2 }),
    map(value => value + 2),
    willBe('    -a-b-c-|', { a: 2, b: 3, c: 4 }),
  ))

test('pullable source just works', () =>
  pipe(
    pullable('(abc|)'),
    willBe('  (abc|)'),
  ))

test('looong test case', () =>
  pipe(
    listenable(
      '--a--------------------------------------------------------a---|',
    ),
    willBe(
      '    --a--------------------------------------------------------a---|',
    ),
  ))
