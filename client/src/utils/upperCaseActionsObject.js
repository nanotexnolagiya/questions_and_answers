export default (values) => {
  const results = {}
  if (!Array.isArray(values) && values.length === 0) return results

  for (const value of values) {
    const valueUpperCase = value.toUpperCase()
    results[valueUpperCase] = valueUpperCase
  }

  return results
}
