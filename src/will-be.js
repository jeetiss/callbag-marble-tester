import { FRAME_SIZE } from './constants'
import { pick } from './utils'
import {
  create,
  parse,
  compareFrames,
  defaultCreators as creators,
} from './marbles'

const message = (expected, received, size) => `
expected: ${create({ frames: expected, size })}
received: ${create({ frames: received, size })}

`

const willBe = (marble, values = {}) => source =>
  new Promise((resolve, reject) => {
    const { frames, size } = parse(marble, values)
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

    const lastCheck = () => {
      if (
        frame + 1 === size &&
        create({ frames: receivedFrames, size }) === create({ frames, size })
      ) {
        resolve()
      } else {
        reject(message(frames, receivedFrames, size))
      }
    }

    source(0, (t, d) => {
      if (t === 0) talkback = d
      if (t === 1) set(creators.next(pick(values, d)))
      if (t === 1 || t === 0) talkback(1)

      if (t === 2) {
        ended = true
        id && clearInterval(id)
        d ? set(creators.error(d)) : set(creators.end())
        talkback(2, d)

        lastCheck()
      }

      if (t === 0 && !ended) {
        id = setInterval(() => {
          if (!compareFrames(receivedFrames.get(frame), frames.get(frame))) {
            clearInterval(id)
            talkback(2)
            reject(message(frames, receivedFrames, frame + 1))
          }

          if (size === frame + 1) {
            clearInterval(id)
            talkback(2)
            lastCheck()
          }

          frame += 1
        }, FRAME_SIZE)
      }
    })
  })

export default willBe
