export interface Pagination {
    page: number
    size: number
}

//@ts-ignore TODO: ver porque no me deja usar enumerador la nueva regla de ts
export enum Operator {
    EQ = "eq",
    NEQ = "neq",
    GT = "gt",
    LT = "lt",
    GTE = "gte",
    LTE = "lte",
    CONTAINS = "contains",
    NOT_CONTAINS = "not_contains",
    STARTS_WITH = "starts_with",
    ENDS_WITH = "ends_with",
}

export interface Filter {
    field: string
    operator: Operator
    value: string
}

export interface Order {
    field: string
    direction: 'asc' | 'desc'
}

export default interface Criteria {
    filters?: Filter[]
    pagination?: Pagination
    orders?: Order[]
}