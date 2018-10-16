const isDefined = value => value != null
const pick = (obj, value) => (isDefined(obj[value]) ? obj[value] : value)

export { pick, isDefined }
