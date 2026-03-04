class PaginationService {
  apply(service) {
    service.paginate = async function (
      page = 1,
      limit = 20,
      findAllFunction,
      countFunction,
      conditions,
    ) {
      limit = limit < 1 ? 20 : Math.min(limit, 500)
      const offset = (page - 1) * limit

      const rows = await findAllFunction(limit, offset, conditions)
      const total = await countFunction(conditions)

      const pagination = {
        current_page: page,
        total,
        per_page: limit,
        from: rows.length > 0 ? offset + 1 : null,
        to: rows.length > 0 ? offset + rows.length : null,
      }

      return {
        rows,
        pagination,
      }
    }
  }
}

module.exports = new PaginationService()
