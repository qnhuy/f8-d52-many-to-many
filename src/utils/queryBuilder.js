function buildWhereClause(conditions) {
  const whereClauses = []
  const params = []

  if (conditions) {
    Object.entries(conditions).forEach(([key, value]) => {
      whereClauses.push(`${key} = ?`)
      params.push(String(value))
    })
  }

  return { whereClauses, params }
}

function buildQueryParams(conditions, limit, offset) {
  const { whereClauses, params } = buildWhereClause(conditions)
  params.push(String(limit), String(offset))

  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  return { whereClauses, params, whereSQL }
}

function buildQueryParamsNoPagination(conditions) {
  const { whereClauses, params } = buildWhereClause(conditions)

  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  return { whereClauses, params, whereSQL }
}

module.exports = {
  buildWhereClause,
  buildQueryParams,
  buildQueryParamsNoPagination,
}
