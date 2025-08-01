import { Criteria } from '../Domain/Criteria';

export abstract class ApiRepository {
    protected readonly baseApiUrl: string;

    constructor(baseApiUrl: string = '/api') {
        this.baseApiUrl = baseApiUrl;
    }

    protected async get<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    protected async post<T>(url: string, data: any): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    protected async put<T>(url: string, data: any): Promise<T> {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    protected async delete(url: string): Promise<void> {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    protected buildQueryParams(criteria: Criteria): string {
        const params = new URLSearchParams();

        if (criteria.page) {
            params.append('page', criteria.page.toString());
        }

        if (criteria.limit) {
            params.append('limit', criteria.limit.toString());
        }

        if (criteria.search) {
            params.append('search', criteria.search);
        }

        if (criteria.filters) {
            criteria.filters.forEach((filter, index) => {
                params.append(`filters[${index}][field]`, filter.field);
                params.append(`filters[${index}][operator]`, filter.operator);
                params.append(`filters[${index}][value]`, filter.value.toString());
            });
        }

        if (criteria.sorts) {
            criteria.sorts.forEach((sort, index) => {
                params.append(`sorts[${index}][field]`, sort.field);
                params.append(`sorts[${index}][direction]`, sort.direction);
            });
        }

        return params.toString();
    }
}