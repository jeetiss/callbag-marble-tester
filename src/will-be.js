import { pick, compare } from './utils'

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
      }

      if (t === 1) {
        received.push(d)
        const test = compare(expected, received)

        if (test === compare.EQUAL || test === compare.DIFFERENT) talkback(2)
        if (test === compare.EQUAL) resolve()
        if (test === compare.DIFFERENT) reject()

        talkback(1)
      }

      if (t === 2) {
        received.push('|')

        const test = compare(expected, received, true)

        if (test === compare.EQUAL || test === compare.DIFFERENT) talkback(2)
        if (test === compare.EQUAL) resolve()
        if (test === compare.DIFFERENT) reject()
      }
    })
  })
}

export default willBe
