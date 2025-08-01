import DataTable from "../SharedKernel/DataTable";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { ListarReservasPaginadas } from "../../modules/Reservas/Application/ListarReservasPaginadas";
import { useReservasContext } from "./ReservasContext";
import type { Reserva } from "../../modules/Reservas/Domain/Reserva";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import { useState } from "react";
import type { DataTableAction } from "../SharedKernel/DataTableActions";
import { useNavigate } from "react-router";
import type { DataRowAction } from "../SharedKernel/DataRowActions";
import { EditRowAction } from "../SharedKernel/RowActions";
import { DeleteRowAction } from "../SharedKernel/RowActions";
import { EliminarReserva } from "../../modules/Reservas/Application/EliminarReserva";
import type { Filter } from "../../modules/SharedKernel/Domain/Criteria";
import ReservasListFilters from "./ReservasListFilters";
import dayjs from "dayjs";

export default function ReservasList() {
    const module = 'reservas'
    const { repository } = useReservasContext()
    const navigate = useNavigate()
    const [paginationSettings, setPaginationSettings] = useState({
        page: 1,
        size: import.meta.env.VITE_DEFAULT_PAGE_SIZE
    })
    const [filters, setFilters] = useState<Filter[]>([])

    const query = useQuery<PaginatedResponse<Reserva>>({
        queryKey: ['reservas', paginationSettings, filters],
        queryFn: () => ListarReservasPaginadas(repository, {
            filters: filters,
            pagination: paginationSettings
        })
    })

    const actions: DataTableAction[] = [
        {
            label: 'Nueva reserva',
            onClick: () => {
                navigate(`/${module}/create`)
            }
        }
    ]

    const rowActions: DataRowAction<Reserva>[] = [
        EditRowAction(module, navigate),
        DeleteRowAction('¿Desea eliminar la reserva?', async (rowItem) => {
            await EliminarReserva(repository, rowItem.id)
            await query.refetch()
        })
    ]

    return (
        <MainLayout>
            <DataTable
                isLoading={query.isLoading}
                title="Reservas"
                columns={[
                    {
                        label: 'Fecha y hora',
                        //TODO: Tomar en cuenta la zona horaria del usuario
                        accessor: (item: Reserva) => dayjs(item.fecha_hora).add(-3, 'hours').format('DD/MM/YYYY HH:mm')
                    },
                    {
                        label: 'Cancha',
                        accessor: (item: Reserva) => item.cancha_nombre
                    },
                    {
                        label: 'Jugador',
                        accessor: (item: Reserva) => item.jugador_nombre
                    },
                    {
                        label: 'Duración',
                        accessor: (item: Reserva) => `${item.duracion / 60} hs`
                    }
                ]}
                rowActions={rowActions}
                data={query.data?.items}
                filters={
                    <ReservasListFilters
                        onSubmit={(f: Filter[]) => {
                            setFilters(f)
                            setPaginationSettings({
                                ...paginationSettings,
                                page: 1
                            })
                        }}
                        loading={query.isLoading}
                    />
                }
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
    )
} 