export interface Filter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'not_in';
    value: any;
}

export interface Sort {
    field: string;
    direction: 'asc' | 'desc';
}

export interface Criteria {
    page?: number;
    limit?: number;
    filters?: Filter[];
    sorts?: Sort[];
    search?: string;
}