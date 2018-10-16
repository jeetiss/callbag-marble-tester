const listenable = (marble, values = {}) => (start, sink) => {
  if (start !== 0) return
  const breakpoints = marble.split('-')
  let unsubscribed = false
  let id = null

  const emitFirst = breakpoints => {
    if (unsubscribed) return
    const [head, ...teil] = breakpoints

    if (head === '|') {
      sink(2)
    } else if (head === 'x') {
      sink(2, { error: 'error!' })
    } else if (head !== '') {
      sink(1, values[head] || head)
    }

    if (teil.length > 0) {
      id = setTimeout(emitFirst, 1, teil)
    }
  }

  sink(0, t => {
    if (t === 2) {
      unsubscribed = true
      id !== null && clearTimeout(id)
    }
  })

  emitFirst(breakpoints)
}

export default listenable
