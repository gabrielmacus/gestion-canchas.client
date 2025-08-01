import DataTable from "../SharedKernel/DataTable";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { ListarReservasPaginadas } from "../../modules/Reservas/Application/ListarReservasPaginadas";
import { useReservasContext } from "./ReservasContext";
import { useCanchasContext } from "../Canchas/CanchasContext";
import { useJugadoresContext } from "../Jugadores/JugadoresContext";
import type { Reserva } from "../../modules/Reservas/Domain/Reserva";
import type { Cancha } from "../../modules/Canchas/Domain/Cancha";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import { useState, useMemo } from "react";
import type { DataTableAction } from "../SharedKernel/DataTableActions";
import { useNavigate } from "react-router";
import type { DataRowAction } from "../SharedKernel/DataRowActions";
import { EditRowAction } from "../SharedKernel/RowActions";
import { DeleteRowAction } from "../SharedKernel/RowActions";
import { EliminarReserva } from "../../modules/Reservas/Application/EliminarReserva";
import type { Filter } from "../../modules/SharedKernel/Domain/Criteria";
import ReservasListFilters from "./ReservasListFilters";
import ListarCanchasPaginadas from "../../modules/Canchas/Application/ListarCanchasPaginadas";
import { ListarJugadoresPaginados } from "../../modules/Jugadores/Application/ListarJugadoresPaginados";
import dayjs from "dayjs";

export default function ReservasList() {
    const module = 'reservas'
    const { repository } = useReservasContext()
    const { repository: canchaRepository } = useCanchasContext()
    const { repository: jugadorRepository } = useJugadoresContext()
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

    // Query para obtener todas las canchas (para lookup)
    const canchasQuery = useQuery<PaginatedResponse<Cancha>>({
        queryKey: ['canchas-lookup'],
        queryFn: () => ListarCanchasPaginadas(canchaRepository, {
            filters: [],
            pagination: { page: 1, size: 1000 }
        })
    })

    // Query para obtener todos los jugadores (para lookup)
    const jugadoresQuery = useQuery<PaginatedResponse<Jugador>>({
        queryKey: ['jugadores-lookup'],
        queryFn: () => ListarJugadoresPaginados(jugadorRepository, {
            filters: [],
            pagination: { page: 1, size: 1000 }
        })
    })

    // Crear mapas para lookup rápido
    const canchasMap = useMemo(() => {
        const map = new Map<string, Cancha>()
        canchasQuery.data?.items?.forEach(cancha => {
            map.set(cancha.id, cancha)
        })
        return map
    }, [canchasQuery.data])

    const jugadoresMap = useMemo(() => {
        const map = new Map<string, Jugador>()
        jugadoresQuery.data?.items?.forEach(jugador => {
            map.set(jugador.id, jugador)
        })
        return map
    }, [jugadoresQuery.data])

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
        DeleteRowAction(module, async (rowItem) => {
            await EliminarReserva(repository, rowItem.id)
            await query.refetch()
        })
    ]

    return (
        <MainLayout>
            <DataTable
                isLoading={query.isLoading || canchasQuery.isLoading || jugadoresQuery.isLoading}
                title="Reservas"
                columns={[
                    {
                        label: 'Fecha y hora',
                        //TODO: Tomar en cuenta la zona horaria del usuario
                        accessor: (item: Reserva) => dayjs(item.fecha_hora).add(-3, 'hours').format('DD/MM/YYYY HH:mm')
                    },
                    {
                        label: 'Cancha',
                        accessor: (item: Reserva) => {
                            const cancha = canchasMap.get(item.cancha_id)
                            return cancha ? `${cancha.nombre}${cancha.techada ? ' (Techada)' : ''}` : item.cancha_id
                        }
                    },
                    {
                        label: 'Jugador',
                        accessor: (item: Reserva) => {
                            const jugador = jugadoresMap.get(item.jugador_id)
                            return jugador ? `${jugador.nombre} ${jugador.apellido}` : item.jugador_id
                        }
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
                        loading={query.isLoading || canchasQuery.isLoading || jugadoresQuery.isLoading}
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