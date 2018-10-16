import { willBe } from '../src'

test('willBe return promise', () => {
  const source = jest.fn()
  const promise = willBe('-a-b-|')(source)

  expect(promise).toBeDefined()
  expect(typeof promise.then).toBe('function')
  expect(source).toBeCalledTimes(1)
})
