import axios from "axios"
import type Criteria from "../Domain/Criteria"
import type PaginatedResponse from "../Domain/PaginatedResponse"
import { parseCriteriaToQuery } from "./CriteriaToQueryParser"
import type Repository from "../Domain/Repository"

interface ApiRepository<T> extends Repository<T> {
}

export function createApiRepository<T>(baseUrl: string): ApiRepository<T> {
    const headers = {
        'Content-Type': 'application/json'
    }
    return {
        getPaginated: async (criteria: Criteria) => {
            const query = parseCriteriaToQuery(criteria)
            const response = await axios.get<PaginatedResponse<T>>(`${baseUrl}?${query}`, {
                headers
            })
            return response.data
        },
        getById: async (id: string) => {
            const response = await axios.get<T>(`${baseUrl}/${id}`, {
                headers
            })
            return response.data
        },
        create: async (entity: T) => {
            const response = await axios.post<T>(baseUrl, entity, {
                headers
            })
            return response.data
        },
        update: async (id: string, entity: Partial<T>) => {
            const response = await axios.patch<T>(`${baseUrl}/${id}`, entity, {
                headers
            })
            return response.data
        },
        delete: async (id: string) => {
            await axios.delete(`${baseUrl}/${id}`, {
                headers
            })
        }
    }
}