const isDefined = value => value != null
const pick = (obj, value) => (isDefined(obj[value]) ? obj[value] : value)

const end = sink => sink(2)

const defaultCreators = {
  end: () => end,
  error: error => sink => sink(2, isDefined(error) ? error : 'error'),
  next: value => sink => sink(1, value),
}

export const parse = (marbles, values, error, userCreators) => {
  const creators = { ...defaultCreators, ...userCreators }
  let fragments = marbles.split('')

  let frameIndex = 0
  let frames = new Map()

  let inGroop = false
  let groopBuffer = []

  const nextFrame = () => (frameIndex += 1)
  const set = value => frames.set(frameIndex, value)

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
        nextFrame()
        continue

      default:
        if (inGroop) {
          groopBuffer.push(creators.next(pick(values, head)))
        } else {
          set([creators.next(pick(values, head))])
          nextFrame()
        }
    }
  }

  return {
    type: frameIndex > 1 ? 'async' : 'sync',
    frames,
    maxFrame: frameIndex,
  }
}
