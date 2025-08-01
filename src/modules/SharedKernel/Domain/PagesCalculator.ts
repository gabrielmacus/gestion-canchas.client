export function calculatePages(total: number, size: number) {
    return Math.ceil(total / size)
}
