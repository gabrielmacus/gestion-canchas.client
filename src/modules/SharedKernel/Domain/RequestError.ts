export default class RequestError extends Error {
    detail: string
    code?: string
    constructor(message: string, detail: string, code?: string) {
        super(message)
        this.detail = detail
        this.code = code
    }
}