import type Criteria from "./Criteria"
import type PaginatedResponse from "./PaginatedResponse"

export interface RequestResponse {

}

export interface Creator<T> {
    create(entity: T): Promise<T>
}

export interface Reader<T> {
    getPaginated(criteria: Criteria): Promise<PaginatedResponse<T>>
    getById(id: string): Promise<T>
}

export interface Updater<T> {
    update(id: string, entity: Partial<T>): Promise<T>
}

export interface Deleter {
    delete(id: string): Promise<void>
}

export default interface Repository<T> extends Creator<T>, Reader<T>, Updater<Partial<T>>, Deleter {
}