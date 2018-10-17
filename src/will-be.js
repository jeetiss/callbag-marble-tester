import { pick, toMarble, compare } from './utils'

const message = (expected, received) =>
  `
expected: ${toMarble(expected)}
received: ${toMarble(received)}

`

const willBe = (marble, values = {}) => source => {
  const breakpoints = marble.split('-')
  const expected = breakpoints.filter(Boolean).map(pick.bind(null, values))

  let received = []
  let talkback

  return new Promise((resolve, reject) => {
    source(0, (t, d) => {
      if (t === 0) {
        talkback = d
        talkback(1)

        return
      }

      received.push(t === 1 ? d : '|')
      const test = compare(expected, received, t === 2)

      if (test === compare.EQUAL || test === compare.DIFFERENT) talkback(2)
      if (test === compare.EQUAL) resolve()
      if (test === compare.DIFFERENT) reject(message(expected, received))

      if (t === 1) talkback(1)
    })
  })
}

export default willBe
