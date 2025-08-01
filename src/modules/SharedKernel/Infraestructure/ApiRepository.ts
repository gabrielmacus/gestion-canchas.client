import axios from "axios"
import type Criteria from "../Domain/Criteria"
import type PaginatedResponse from "../Domain/PaginatedResponse"
import { parseCriteriaToQuery } from "./CriteriaToQueryParser"
import type Repository from "../Domain/Repository"
import { AxiosError } from "axios"
import RequestError from "../Domain/RequestError"

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
            try {
                const response = await axios.get<T>(`${baseUrl}/${id}`, {
                    headers
                })
                return response.data
            } catch (error) {
                if (error instanceof AxiosError && error.response?.data.detail) {
                    throw new RequestError(error.message, error.response?.data.detail, error.response?.data.code ?? "UNKNOWN_ERROR")
                }
                throw error
            }
        },
        create: async (entity: T) => {
            try {
                const response = await axios.post<T>(baseUrl, entity, {
                    headers
                })
                return response.data
            } catch (error) {
                if (error instanceof AxiosError && error.response?.data.detail) {
                    throw new RequestError(error.message, error.response?.data.detail, error.response?.data.code)
                }
                throw error
            }
        },
        update: async (id: string, entity: Partial<T>) => {
            try {
                const response = await axios.patch<T>(`${baseUrl}/${id}`, entity, {
                    headers
                })
                return response.data
            } catch (error) {
                if (error instanceof AxiosError && error.response?.data.detail) {
                    throw new RequestError(error.message, error.response?.data.detail, error.response?.data.code)
                }
                throw error
            }
        },
        delete: async (id: string) => {
            try {
                await axios.delete(`${baseUrl}/${id}`, {
                    headers
                })
            } catch (error) {
                if (error instanceof AxiosError && error.response?.data.detail) {
                    throw new RequestError(error.message, error.response?.data.detail, error.response?.data.code)
                }
                throw error
            }
        }
    }
}