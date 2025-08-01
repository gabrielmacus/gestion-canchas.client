import DataTable from "../SharedKernel/DataTable";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import ListarCanchasPaginadas from "../../modules/Canchas/Application/ListarCanchasPaginadas";
import { useCanchasContext } from "./CanchasContext";
import type { Cancha } from "../../modules/Canchas/Domain/Cancha";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import { useState } from "react";
import type { DataTableAction } from "../SharedKernel/DataTableActions";
import { useNavigate } from "react-router";
import type { DataRowAction } from "../SharedKernel/DataRowActions";
import { EditRowAction } from "../SharedKernel/RowActions";
import { DeleteRowAction } from "../SharedKernel/RowActions";
import EliminarCancha from "../../modules/Canchas/Application/EliminarCancha";
import type { Filter } from "../../modules/SharedKernel/Domain/Criteria";
import CanchasListFilters from "./CanchasListFilters";
import { notifications } from "@mantine/notifications";


export default function CanchasList() {
    const module = 'canchas'
    const { repository } = useCanchasContext()
    const navigate = useNavigate()
    const [paginationSettings, setPaginationSettings] = useState({
        page: 1,
        size: import.meta.env.VITE_DEFAULT_PAGE_SIZE
    })
    const [filters, setFilters] = useState<Filter[]>([])
    const query = useQuery<PaginatedResponse<Cancha>>({
        queryKey: ['canchas', paginationSettings, filters],
        queryFn: () => ListarCanchasPaginadas(repository, {
            filters: filters,
            pagination: paginationSettings
        })
    })

    const actions: DataTableAction[] = [
        {
            label: 'Nueva cancha',
            onClick: () => {
                navigate(`/${module}/create`)
            }
        }
    ]
    const rowActions: DataRowAction<Cancha>[] = [
        EditRowAction(module, navigate),
        DeleteRowAction('¿Desea eliminar la cancha?', async (rowItem) => {
            try {
                await EliminarCancha(repository, rowItem.id)
                await query.refetch()
            } catch (error) {
                notifications.show({
                    title: 'Error al eliminar la cancha',
                    message: 'Compruebe que la cancha no tenga reservas asociadas e intente nuevamente. Si el problema persiste, contacte al administrador.',
                    color: 'red',
                    autoClose: 20000
                })
            }
        })
    ]
    return <MainLayout>
        <DataTable
            isLoading={query.isLoading}
            title="Canchas"
            columns={[
                { label: 'Nombre', accessor: 'nombre' },
                {
                    label: 'Techada',
                    accessor: (item: Cancha) => item.techada ? 'Sí' : 'No'
                }
            ]}
            rowActions={rowActions}
            data={query.data?.items}
            filters={<CanchasListFilters onSubmit={(f: Filter[]) => {
                setFilters(f)
                setPaginationSettings({
                    ...paginationSettings,
                    page: 1
                })
            }} loading={query.isLoading} />}
            actions={actions}
            paginationData={query.data ? {
                total: query.data.total,
                page: query.data.page_number,
                size: query.data.page_size
            } : undefined}

            onPageChange={(page) => {
                setPaginationSettings({
                    ...paginationSettings,
                    page: page
                })
            }}
        />
    </MainLayout>
} 