import { Box, Group, LoadingOverlay, Paper, Table, Text } from "@mantine/core";
import DataPagination from "./DataPagination";
import type { DataTableAction } from "./DataTableActions";
import DataTableActions from "./DataTableActions";
import type { DataRowAction } from "./DataRowActions";
import DataRowActions from "./DataRowActions";

export interface DataTableProps<T> {
    columns: {
        label: string
        accessor: keyof T | ((item: T) => string)
    }[]
    data?: T[]
    actions?: DataTableAction[]
    rowActions?: DataRowAction<T>[]
    isLoading?: boolean
    paginationData?: {
        total: number
        page: number
        size: number
    }
    onPageChange?: (page: number) => void
    filters?: React.ReactNode
    id_accessor?: keyof T
    title?: string
}

export default function DataTable<T>({ columns, data, id_accessor, paginationData, onPageChange, actions, rowActions, title, isLoading, filters }: DataTableProps<T>) {
    const _id_accessor = id_accessor ?? 'id' as keyof T
    const hasActions = actions && actions.length > 0
    const shouldRenderFooter = paginationData || hasActions

    const renderHeaders = () => {
        return columns.map((column) => (
            <Table.Th key={column.accessor as string}>{column.label}</Table.Th>
        ))
    }
    const renderRows = () => {
        return data?.map((item) => (
            <Table.Tr key={item[_id_accessor] as string}>
                {columns.map((column) => {
                    const value = typeof column.accessor === 'function' ?
                        column.accessor(item) :
                        item[column.accessor as keyof T]
                    return <Table.Td key={column.accessor as string}>{value as string}</Table.Td>
                })}
                {rowActions && <Table.Td>
                    <DataRowActions actions={rowActions} rowItem={item} />
                </Table.Td>}
            </Table.Tr>
        ))
    }


    return <Paper shadow="sm" p="lg" maw={900} >
        <Box pos="relative"  >
            {title && <Text fw={600} size="lg" mb={'md'} >{title}</Text>}
            {filters && <Box mb={'md'}>{filters}</Box>}
            <Table mb={'xl'} striped withTableBorder >
                <Table.Thead>
                    <Table.Tr>
                        {renderHeaders()}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {renderRows()}
                </Table.Tbody>

            </Table>
            {shouldRenderFooter && <Group justify="space-between">
                {paginationData &&
                    <DataPagination
                        paginationData={paginationData}
                        onPageChange={onPageChange}
                    />
                }

                {hasActions && <DataTableActions actions={actions} />}
            </Group>}
            <LoadingOverlay overlayProps={{ radius: "sm", blur: 2, zIndex: 1000 }} visible={isLoading} />
        </Box>
    </Paper>
}