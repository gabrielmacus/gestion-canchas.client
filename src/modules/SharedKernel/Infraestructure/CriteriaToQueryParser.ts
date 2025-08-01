import type Criteria from "../Domain/Criteria"

export function parseCriteriaToQuery(criteria: Criteria) {
    const { filters, pagination } = criteria
    const query = new URLSearchParams()
    query.append('q', JSON.stringify(filters))
    if (pagination) {
        query.append('page', pagination.page.toString())
        query.append('size', pagination.size.toString())
    }
    return query.toString()
}