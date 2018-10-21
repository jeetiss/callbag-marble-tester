import { FRAME_SIZE } from './constants'
import { pick } from './utils'
import { create, parse, defaultCreators as creators } from './marbles'

const message = (expected, received) =>
  `
expected: ${expected}
received: ${received}

`

const willBe = (marble, values = {}) => source =>
  new Promise((resolve, reject) => {
    let receivedFrames = new Map()
    let frame = 0

    const set = creator => {
      if (receivedFrames.has(frame)) {
        const creators = receivedFrames.get(frame)
        creators.push(creator)
        receivedFrames.set(frame, creators)
      } else {
        receivedFrames.set(frame, [creator])
      }
    }

    let talkback
    let ended = false
    let id

    source(0, (t, d) => {
      if (t === 0) {
        talkback = d
        talkback(1)
        if (!id && !ended) {
          id = setInterval(() => (frame += 1), FRAME_SIZE)
        }

        return
      }

      if (t === 1) {
        set(creators.next(pick(values, d)))
        talkback(1)
      }

      if (t === 2) {
        ended = true
        id && clearInterval(id)
        d ? set(creators.error(d)) : set(creators.end())
        talkback(2)

        const received = create({ frames: receivedFrames, size: frame + 1 })
        if (received === marble.trim()) {
          resolve()
        } else {
          reject(message(marble.trim(), received))
        }
      }
    })
  })

export default willBe
