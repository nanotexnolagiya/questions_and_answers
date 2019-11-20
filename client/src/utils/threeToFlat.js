export default (three) => {
  return convert(three)
}

function convert (three, prefix = '') {
  return three.reduce((acc, el) => {
    const clone = Object.assign({}, el, { name: prefix + el.name })
    acc.push(clone)
    if (el.children.length) {
      acc = acc.concat(convert(el.children, prefix + '--'))
    }
    return acc
  }, [])
}
