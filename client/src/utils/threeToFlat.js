export default (three) => {
  console.log(convert(three))
  return convert(three)
}

function convert (three, prefix = '') {
  return three.reduce((acc, el) => {
    const clone = Object.assign({}, el, { name: prefix + el.name })
    acc.push(clone)
    if (el.children.length) {
      clone.disabled = 'disabled'
      acc = acc.concat(convert(el.children, prefix + '--'))
    }
    return acc
  }, [])
}
