module.exports = (queries, columns) => {
  const result = {}

  for (const column of columns) {
    if (!Number.isInteger(queries[column]) && queries[column]) {
      const filterColumn = queries[column].split(':')
      if (filterColumn.length > 1) {
        result[column] = {}
        const filterColumnValues = filterColumn[1].split(',')
        if (filterColumnValues.length > 1) {
          result[column][`$${filterColumn[0]}`] = filterColumnValues
        } else {
          result[column][`$${filterColumn[0]}`] = filterColumnValues[0]
        }
      } else {
        result[column] = filterColumn[0]
      }
    } else if (Number.isInteger(queries[column])) {
      result[column] = queries[column]
    }
  }

  return result
}
