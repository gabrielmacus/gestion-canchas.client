import type Criteria from "../Domain/Criteria"

export function parseCriteriaToQuery(criteria: Criteria) {
    const { filters, pagination } = criteria
    const query = new URLSearchParams()
    query.append('q', JSON.stringify(filters))
    if (pagination) {
        query.append('page', pagination.page.toString())
        query.append('size', pagination.size.toString())
    }
    if (criteria.orders) {
        query.append('orders', criteria.orders.map(order => `${order.field}:${order.direction}`).join(','))
    }
    return query.toString()
}