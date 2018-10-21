import { isDefined, pick } from './utils'

export const defaultCreators = {
  end: () => sink => sink(2),
  error: error => sink => sink(2, isDefined(error) ? error : 'error'),
  next: value => sink => sink(1, value),
}

export const parse = (marbles, values = {}, error, userCreators) => {
  const creators = { ...defaultCreators, ...userCreators }
  let fragments = marbles.trim().split('')

  let frameIndex = 0
  let frames = new Map()

  let inGroop = false
  let groopBuffer = []

  const nextFrame = () => (frameIndex += 1)
  const set = value => {
    frames.set(frameIndex, value)
    nextFrame()
  }

  while (fragments.length !== 0) {
    const [head, ...teil] = fragments
    fragments = teil

    switch (head) {
      case '-':
        nextFrame()
        continue
      case '|':
        inGroop ? groopBuffer.push(creators.end()) : set([creators.end()])
        continue
      case 'x':
        inGroop
          ? groopBuffer.push(creators.error(error))
          : set([creators.error(error)])
        continue
      case '(':
        inGroop = true
        continue
      case ')':
        set(groopBuffer)
        inGroop = false
        groopBuffer = []
        continue

      default:
        inGroop
          ? groopBuffer.push(creators.next(pick(values, head)))
          : set([creators.next(pick(values, head))])
    }
  }

  return {
    frames,
    size: frameIndex,
  }
}

const eventNames = 'abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWYZ'

export const create = ({ frames, size }) => {
  let marbles = ''
  const events = new Map()
  let next = 0

  const getName = value => {
    if (events.has(value)) {
      return events.get(value)
    } else {
      const event = eventNames[next++]
      events.set(value, event)
      return event
    }
  }

  const sink = (t, d) => {
    if (t === 1) return getName(d)
    if (t === 2 && !d) return '|'
    if (t === 2 && d) return 'x'
  }

  for (let i = 0; i < size; ++i) {
    if (frames.has(i)) {
      const frame = frames
        .get(i)
        .map(creator => creator(sink))
        .join('')

      marbles += frame.length > 1 ? `(${frame})` : frame
    } else {
      marbles += '-'
    }
  }

  return marbles
}
