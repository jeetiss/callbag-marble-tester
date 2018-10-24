import map from 'callbag-map'
import pipe from 'callbag-pipe'
import merge from 'callbag-merge'

import { listenable, pullable, willBe } from '../src'

test('listenable source just works', () =>
  pipe(
    listenable('-q-w-c-|'),
    willBe('    -q-w-c-|'),
  ))

test('map listenable source', () =>
  pipe(
    listenable('-a-b-c-|', { a: 0, b: 1, c: 2 }),
    map(value => value + 2),
    willBe('    -a-b-c-|', { a: 2, b: 3, c: 4 }),
  ))

test('pullable source just works', () =>
  pipe(
    pullable('(czc|)'),
    willBe('  (czc|)'),
  ))

test('looong test case', () =>
  pipe(
    merge(
      listenable(
        '--a--------------------------------------------------------a--|',
      ),
      listenable(
        '--b--------------------------------------------------------b--|',
      ),
    ),
    willBe(
      '  --(ab)--------------------------------------------------------(ab)--|',
    ),
  ))

test('compare different events', () =>
  expect(
    pipe(
      listenable('qaq|'),
      willBe('    qcq|'),
    ),
  ).rejects.toBeDefined())

test('compare different time of events', () =>
  expect(
    pipe(
      listenable('----q-a-q-|'),
      willBe('    ----q-a-q|'),
    ),
  ).rejects.toBeDefined())

test('compare different time of events', () =>
  expect(
    pipe(
      listenable('----q-a-q-|'),
      willBe('    ---q-a-q-|'),
    ),
  ).rejects.toBeDefined())

test('compare different time of events', () =>
  expect(
    pipe(
      listenable('----q-a-q-'),
      willBe('    ---q-a-q-'),
    ),
  ).rejects.toBeDefined())

test('inf listenable source works', () =>
  pipe(
    listenable('-q-w-c-'),
    willBe('    -q-w-c-'),
  ))
