import { pick } from './utils'
import { parse } from './marbles'

const pullable = (marble, values = {}) => (start, sink) => {
  if (start !== 0) return

  const { frames, type } = parse(marble, values)

  if (type !== 'sync') throw new Error("pullable source can't be async")

  const emitters = frames.get(0)
  let index = 0

  sink(0, (t, d) => {
    if (t === 1) emitters[index++](sink)
  })
}

export default pullable
