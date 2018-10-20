import subscribe from 'callbag-subscribe'

import { pullable } from '../src'

test('pullable source did work', () => {
  const expected = ['a', 'b', 'c', 'd']
  const received = []

  subscribe(data => received.push(data))(pullable('(abcd|)'))

  expect(received).toEqual(expected)
})

test('pullable source did work with values', () => {
  const expected = [1, 1, 2, 2]
  const received = []

  subscribe(data => received.push(data))(pullable('(aabb|)', { a: 1, b: 2 }))

  expect(received).toEqual(expected)
})

test('pullable source did catch error', () => {
  const expected = ['a']
  const received = []
  const error = jest.fn()

  subscribe({
    next: data => received.push(data),
    error,
  })(pullable('(ax)'))

  expect(received).toEqual(expected)
  expect(error).toHaveBeenCalled()
})

test('async pullable source did catch error', () => {
  expect(() => {
    subscribe()(pullable('-a-(bc)-|'))
  }).toThrow()
})
