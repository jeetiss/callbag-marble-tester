import { parse, create } from '../src/marbles'

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

test('parse async one after one', () => {
  const { frames, size } = testParse('aa|')

  expect(size).toBe(3)
  expect(frames.get(0)).toEqual(['a'])
  expect(frames.get(1)).toEqual(['a'])
  expect(frames.get(2)).toEqual(['end'])
})

test('parse sync groop', () => {
  const { frames, size } = testParse('(aa|)')

  expect(size).toBe(1)
  expect(frames.get(0)).toEqual(['a', 'a', 'end'])
})

test('parse async groop', () => {
  const { frames, size } = testParse('--(aa)--|')

  expect(size).toBe(6)
  expect(frames.get(2)).toEqual(['a', 'a'])
  expect(frames.get(5)).toEqual(['end'])
})

test('parse error', () => {
  const { frames, size } = testParse('-a-a-x')

  expect(size).toBe(6)
  expect(frames.get(1)).toEqual(['a'])
  expect(frames.get(3)).toEqual(['a'])
  expect(frames.get(5)).toEqual(['error'])
})

test('parse empty', () => {
  const { frames, size } = testParse('|')

  expect(size).toBe(1)
  expect(frames.get(0)).toEqual(['end'])
})

test('parse error', () => {
  const { frames, size } = testParse('x')

  expect(size).toBe(1)
  expect(frames.get(0)).toEqual(['error'])
})

test('create marble', () => {
  const ast = {
    frames: new Map([[0, [sink => sink(1, 'a')]], [1, [sink => sink(2)]]]),
    size: 2,
  }

  const marbles = create(ast)

  expect(marbles).toBe('a|')
})

test('create marble with async groop', () => {
  const ast = {
    frames: new Map([
      [2, [sink => sink(1, 'a'), sink => sink(1, 'a'), sink => sink(1, 'a')]],
      [5, [sink => sink(2)]],
    ]),
    size: 6,
  }

  const marbles = create(ast)

  expect(marbles).toBe('--(aaa)--|')
})

test('create sync marble', () => {
  const ast = {
    frames: new Map([
      [0, [sink => sink(1, 'a'), sink => sink(1, 'a'), sink => sink(2)]],
    ]),
    size: 1,
  }

  const marbles = create(ast)

  expect(marbles).toBe('(aa|)')
})

test('create sync marble with error', () => {
  const ast = {
    frames: new Map([
      [
        0,
        [sink => sink(1, 'a'), sink => sink(1, 'a'), sink => sink(2, 'error')],
      ],
    ]),
    size: 1,
  }

  const marbles = create(ast)

  expect(marbles).toBe('(aax)')
})

test('create async marble with error', () => {
  const ast = {
    frames: new Map([
      [2, [sink => sink(1, 'a')]],
      [4, [sink => sink(1, 'b')]],
      [6, [sink => sink(1, 'c')]],
      [8, [sink => sink(2, 'error')]],
    ]),
    size: 9,
  }

  const marbles = create(ast)

  expect(marbles).toBe('--a-b-c-x')
})

test('create marble with custom values', () => {
  const ast = {
    frames: new Map([
      [1, [sink => sink(1, 3)]],
      [3, [sink => sink(1, 4)]],
      [5, [sink => sink(1, 5)]],
      [7, [sink => sink(2)]],
    ]),
    size: 8,
  }

  const marbles = create(ast)

  expect(marbles).toBe('-a-b-c-|')
})
