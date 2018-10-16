const pullable = (marble, values = {}) => (start, sink) => {
  if (start !== 0) return
  const breakpoints = marble.split('-').filter(Boolean)
  let index = 0
  let completed = false

  sink(0, (t, d) => {
    if (completed) return

    if (t === 1) {
      const next = breakpoints[index++]

      if (next === '|') {
        sink(2)
        completed = true
      } else if (next === 'x') {
        sink(2, { error: 'error' })
      } else {
        sink(1, values[next] || next)
      }
    } else if (t === 2) {
      completed = true
    }
  })
}

export default pullable
