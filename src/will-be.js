import { pick } from './utils'

const compare = function(a, b) {
  if (!a || !b) return false

  if (a.length != b.length) return false

  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

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
        talkback(1)
      }

      if (t === 2) {
        received.push('|')

        if (compare(expected, received)) {
          resolve('test works!')
        } else {
          console.log(received, expected)
          reject('woops!')
        }
      }
    })
  })
}

export default willBe
