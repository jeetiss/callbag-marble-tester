import { compare } from '../src/utils'

test('compare not complite', () => {
  expect(compare([1, 2, 3], [1, 2])).toBe(compare.NOT_COMPLITE)
  expect(compare([1, 2, 3], [1, 2, 3])).toBe(compare.EQUAL)
  expect(compare([1, 2, 3], [2, 2, 3])).toBe(compare.DIFFERENT)
  expect(compare([2, 2, 3], [1, 2, 3])).toBe(compare.DIFFERENT)
  expect(compare([1, 2, 3], [1, 2, 3, 4])).toBe(compare.DIFFERENT)
})

test('compare complite', () => {
  expect(compare([1, 2, 3], [1, 2], true)).toBe(compare.DIFFERENT)
  expect(compare([1, 2, 3], [1, 2, 3], true)).toBe(compare.EQUAL)
  expect(compare([1, 2, 3], [2, 2, 3], true)).toBe(compare.DIFFERENT)
  expect(compare([2, 2, 3], [1, 2, 3], true)).toBe(compare.DIFFERENT)
  expect(compare([1, 2, 3], [1, 2, 3, 4], true)).toBe(compare.DIFFERENT)
})
