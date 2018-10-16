const isDefined = value => value != null
const pick = (obj, value) => (isDefined(obj[value]) ? obj[value] : value)

const DIFFERENT = 0
const NOT_COMPLITE = 1
const EQUAL = 2

const compare = function(expected, received, complete) {
  if (complete && expected.length !== received.length) return DIFFERENT

  const length = received.length

  for (let i = 0; i < length; i++) {
    if (expected[i] !== received[i]) {
      return DIFFERENT
    }
  }

  return expected.length === received.length ? EQUAL : NOT_COMPLITE
}

compare.DIFFERENT = DIFFERENT
compare.NOT_COMPLITE = NOT_COMPLITE
compare.EQUAL = EQUAL

export { pick, isDefined, compare }
