# callbag-marble-tester

Callbag utils for testing different operators.

## install

```
npm i -D @jeetiss/callbag-marble-tester
```

## Example

```js
import map from 'callbag-map'
import pipe from 'callbag-pipe'

import { listenable, willBe } from '@jeetiss/callbag-marble-tester'

test('test map operator', () =>
  pipe(
    listenable('--a--b--c-|'),
    map(value => value.toUpperCase()),
    willBe('--A--B--C-|'),
  ))
```
