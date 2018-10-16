# callbag-testing-utils

Callbag utils for testing deferent operators.

## install

```
npm i -D @jeetiss/callbag-testing-utils
```

## Example

```js
import map from 'callbag-map'
import pipe from 'callbag-pipe'

import { listenable, willBe } from '../src'

test('test map operator', () =>
  pipe(
    listenable('--a--b--c-|'),
    map(value => value.toUpperCase()),
    willBe('--A--B--C-|'),
  ))
```
