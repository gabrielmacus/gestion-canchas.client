import { Pagination } from "@mantine/core";
import { calculatePages } from "../../modules/SharedKernel/Domain/PagesCalculator";

export interface DataPaginationProps {
    paginationData: {
        total: number
        page: number
        size: number
    }
    onPageChange?: (page: number) => void
}

export default function DataPagination({ paginationData, onPageChange }: DataPaginationProps) {
    const pages = calculatePages(paginationData.total, paginationData.size)
    return (
        <Pagination
            total={pages}
            value={paginationData.page}
            onChange={(page) => onPageChange?.(page)}
            siblings={2}
        />
    )
}
