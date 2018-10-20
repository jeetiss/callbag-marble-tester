import { parse } from '../src/marbles'

const testCreators = {
  end: () => 'end',
  error: () => 'error',
  next: value => value,
}

test('async one after one', () => {
  const { frames, type } = parse('aa|', testCreators)

  expect(type).toBe('async')
  expect(frames.get(0)).toEqual(['a'])
  expect(frames.get(1)).toEqual(['a'])
  expect(frames.get(2)).toEqual(['end'])
})

test('sync groop', () => {
  const { frames, type } = parse('(aa|)', testCreators)

  expect(type).toBe('sync')
  expect(frames.get(0)).toEqual(['a', 'a', 'end'])
})

test('async groop', () => {
  const { frames, type } = parse('--(aa)--|', testCreators)

  expect(type).toBe('async')
  expect(frames.get(2)).toEqual(['a', 'a'])
  expect(frames.get(5)).toEqual(['end'])
})

test('async groop', () => {
  const { frames, type } = parse('--(aa)--|', testCreators)

  expect(type).toBe('async')
  expect(frames.get(2)).toEqual(['a', 'a'])
  expect(frames.get(5)).toEqual(['end'])
})

test('error', () => {
  const { frames, type } = parse('-a-a-x', testCreators)

  expect(type).toBe('async')
  expect(frames.get(1)).toEqual(['a'])
  expect(frames.get(3)).toEqual(['a'])
  expect(frames.get(5)).toEqual(['error'])
})

test('empty', () => {
  const { frames, type } = parse('|', testCreators)

  expect(type).toBe('sync')
  expect(frames.get(0)).toEqual(['end'])
})

test('error', () => {
  const { frames, type } = parse('x', testCreators)

  expect(type).toBe('sync')
  expect(frames.get(0)).toEqual(['error'])
})
