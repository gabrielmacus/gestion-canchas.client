import DataTable from "../SharedKernel/DataTable";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { ListarJugadoresPaginados } from "../../modules/Jugadores/Application/ListarJugadoresPaginados";
import { useJugadoresContext } from "./JugadoresContext";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import { useState } from "react";
import type { DataTableAction } from "../SharedKernel/DataTableActions";
import { useNavigate } from "react-router";
import type { DataRowAction } from "../SharedKernel/DataRowActions";
import { EditRowAction } from "../SharedKernel/RowActions";
import { DeleteRowAction } from "../SharedKernel/RowActions";
import { EliminarJugador } from "../../modules/Jugadores/Application/EliminarJugador";
import JugadoresListFilters from "./JugadoresListFilters";
import type { Filter } from "../../modules/SharedKernel/Domain/Criteria";


export default function JugadoresList() {
    const module = 'jugadores'
    const { repository } = useJugadoresContext()
    const navigate = useNavigate()
    const [paginationSettings, setPaginationSettings] = useState({
        page: 1,
        size: import.meta.env.VITE_DEFAULT_PAGE_SIZE
    })
    const [filters, setFilters] = useState<Filter[]>([])
    const query = useQuery<PaginatedResponse<Jugador>>({
        queryKey: ['jugadores', paginationSettings,],
        queryFn: () => ListarJugadoresPaginados(repository, {
            filters: filters,
            pagination: paginationSettings,
            orders: [{
                field: 'apellido',
                direction: 'asc'
            }]
        })
    })
    const actions: DataTableAction[] = [
        {
            label: 'Nuevo jugador',
            onClick: () => {
                navigate(`/${module}/create`)
            }
        }
    ]
    const rowActions: DataRowAction<Jugador>[] = [
        EditRowAction(module, navigate),
        DeleteRowAction('¿Desea eliminar el jugador?', async (rowItem) => {
            await EliminarJugador(repository, rowItem.id)
            await query.refetch()
        })
    ]
    return <MainLayout>
        <DataTable
            isLoading={query.isLoading}
            title="Jugadores"
            columns={[
                { label: 'Apellido', accessor: 'apellido' },
                { label: 'Nombre', accessor: 'nombre' }
            ]}
            rowActions={rowActions}
            data={query.data?.items}
            filters={<JugadoresListFilters onSubmit={(f) => {
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