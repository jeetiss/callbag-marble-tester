import subscribe from 'callbag-subscribe'

import { listenable } from '../src'

test('listenable source did work', () => {
  const expected = ['a', 'b', 'c', 'd']
  const received = []

  return new Promise(resolve => {
    subscribe({
      next: data => received.push(data),
      complete: () => {
        expect(received).toEqual(expected)
        resolve()
      },
    })(listenable('-a-b-c-d-|'))
  })
})

test('listenable source did work with values', () => {
  const expected = [1, 1, 2, 2]
  const received = []

  return new Promise(resolve => {
    subscribe({
      next: data => received.push(data),
      complete: () => {
        expect(received).toEqual(expected)
        resolve()
      },
    })(listenable('-a-a-b-b-|', { a: 1, b: 2 }))
  })
})

test('listenable source did catch error', () => {
  const expected = ['a']
  const received = []

  return new Promise(resolve => {
    subscribe({
      next: data => received.push(data),
      error: () => {
        expect(received).toEqual(expected)
        resolve()
      },
    })(listenable('-a------x'))
  })
})
