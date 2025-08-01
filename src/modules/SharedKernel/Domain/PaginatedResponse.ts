export default interface PaginatedResponse<T> {
    items: T[]
    total: number
    page_number: number
    page_size: number
}