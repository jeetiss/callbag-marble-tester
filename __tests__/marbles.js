import { parse } from '../src/marbles'

const testCreators = {
  end: () => 'end',
  error: () => 'error',
  next: value => value,
}

const bindLastArg = (fn, arg) => (...args) => {
  let modifiedArgs = args
  modifiedArgs[fn.length - 1] = arg

  return fn(...modifiedArgs)
}

const testParse = bindLastArg(parse, testCreators)

test('async one after one', () => {
  const { frames, type } = testParse('aa|')

  expect(type).toBe('async')
  expect(frames.get(0)).toEqual(['a'])
  expect(frames.get(1)).toEqual(['a'])
  expect(frames.get(2)).toEqual(['end'])
})

test('sync groop', () => {
  const { frames, type } = testParse('(aa|)')

  expect(type).toBe('sync')
  expect(frames.get(0)).toEqual(['a', 'a', 'end'])
})

test('async groop', () => {
  const { frames, type } = testParse('--(aa)--|')

  expect(type).toBe('async')
  expect(frames.get(2)).toEqual(['a', 'a'])
  expect(frames.get(5)).toEqual(['end'])
})

test('async groop', () => {
  const { frames, type } = testParse('--(aa)--|')

  expect(type).toBe('async')
  expect(frames.get(2)).toEqual(['a', 'a'])
  expect(frames.get(5)).toEqual(['end'])
})

test('error', () => {
  const { frames, type } = testParse('-a-a-x')

  expect(type).toBe('async')
  expect(frames.get(1)).toEqual(['a'])
  expect(frames.get(3)).toEqual(['a'])
  expect(frames.get(5)).toEqual(['error'])
})

test('empty', () => {
  const { frames, type } = testParse('|')

  expect(type).toBe('sync')
  expect(frames.get(0)).toEqual(['end'])
})

test('error', () => {
  const { frames, type } = testParse('x')

  expect(type).toBe('sync')
  expect(frames.get(0)).toEqual(['error'])
})
