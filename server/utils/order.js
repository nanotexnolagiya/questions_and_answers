module.exports = sorts => {
  const result = []
  if (sorts) {
    for (const sort of sorts.split(',')) {
      result.push(sort.split(':'))
    }
  }
  return result
}
