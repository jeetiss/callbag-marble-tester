import { pick } from './utils'
import { parse } from './marbles'

const listenable = (marble, values = {}) => (start, sink) => {
  if (start !== 0) return
  const { frames, maxFrame } = parse(marble, values)
  let timeoutId = null

  const emit = frame => {
    if (frames.has(frame)) {
      frames.get(frame).forEach(emitter => emitter(sink))
    }

    if (frame < maxFrame) {
      timeoutId = setTimeout(emit, 1, frame + 1)
    }
  }

  sink(0, t => {
    if (t === 2) {
      timeoutId !== null && clearTimeout(timeoutId)
    }
  })

  emit(0)
}

export default listenable
