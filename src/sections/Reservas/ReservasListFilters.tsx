import { useForm } from "@mantine/form";
import { Accordion, Button, Group, Paper, Stack, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { Operator, type Filter } from "../../modules/SharedKernel/Domain/Criteria";
import { useSearchParams } from "react-router";
import { z } from "zod";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCanchasContext } from "../Canchas/CanchasContext";
import { useJugadoresContext } from "../Jugadores/JugadoresContext";
import ListarCanchasPaginadas from "../../modules/Canchas/Application/ListarCanchasPaginadas";
import { ListarJugadoresPaginados } from "../../modules/Jugadores/Application/ListarJugadoresPaginados";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import type { Cancha } from "../../modules/Canchas/Domain/Cancha";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import dayjs from "dayjs";

export interface ReservasFilters {
    fecha?: Date | null
    cancha_id?: string | null
    jugador_id?: string | null
}

export interface ReservasListFiltersProps {
    onSubmit: (values: Filter[]) => void
    loading?: boolean
}

export default function ReservasListFilters({ onSubmit, loading }: ReservasListFiltersProps) {
    const { repository: canchaRepository } = useCanchasContext()
    const { repository: jugadorRepository } = useJugadoresContext()

    // Query para obtener todas las canchas
    const canchasQuery = useQuery<PaginatedResponse<Cancha>>({
        queryKey: ['canchas-all-filters'],
        queryFn: () => ListarCanchasPaginadas(canchaRepository, {
            filters: [],
            pagination: { page: 1, size: 1000 }
        })
    })

    // Query para obtener todos los jugadores
    const jugadoresQuery = useQuery<PaginatedResponse<Jugador>>({
        queryKey: ['jugadores-all-filters'],
        queryFn: () => ListarJugadoresPaginados(jugadorRepository, {
            filters: [],
            pagination: { page: 1, size: 1000 }
        })
    })

    const parseQueryString = () => {
        const q = searchParams.get('q')
        if (!q) return
        try {
            const values = schema.parse(JSON.parse(q))
            return values
        }
        catch (e) {
            console.error(e)
        }
        return {}
    }

    const schema = z.object({
        fecha: z.string().optional().nullable().transform(str => str ? dayjs(str).toDate() : null),
        cancha_id: z.string().nullish(),
        jugador_id: z.string().nullish()
    })

    const [searchParams, _] = useSearchParams()
    const initialValues = parseQueryString()
    const isOpen = searchParams.get('q') ? 'header' : undefined
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: initialValues,
        validate: zod4Resolver(schema)
    })

    useEffect(() => {
        parseQueryString()
    }, [])

    const onSubmitForm = (values: ReservasFilters) => {
        const filters: Filter[] = []

        if (values.fecha) {
            const from_date = dayjs(values.fecha).startOf('day')
            const to_date = dayjs(values.fecha).endOf('day')
            console.log(from_date, to_date)
            filters.push({
                field: 'fecha_hora',
                operator: Operator.GTE,
                value: from_date.format("YYYY-MM-DD HH:mm:ss")
            })
            filters.push({
                field: 'fecha_hora',
                operator: Operator.LTE,
                value: to_date.format("YYYY-MM-DD HH:mm:ss")
            })
        }
        if (values.cancha_id?.trim()) {
            filters.push({
                field: 'cancha_id',
                operator: Operator.EQ,
                value: values.cancha_id
            })
        }

        if (values.jugador_id?.trim()) {
            filters.push({
                field: 'jugador_id',
                operator: Operator.EQ,
                value: values.jugador_id
            })
        }

        onSubmit(filters)
    }

    // Preparar opciones para los selects
    const canchaOptions = canchasQuery.data?.items?.map((cancha: Cancha) => ({
        value: cancha.id,
        label: `${cancha.nombre}${cancha.techada ? ' (Techada)' : ''}`
    })) || []

    const jugadorOptions = jugadoresQuery.data?.items?.map((jugador: Jugador) => ({
        value: jugador.id,
        label: `${jugador.nombre} ${jugador.apellido}`
    })) || []

    return (
        <Paper shadow="xs" bg={'gray.0'}>
            <Accordion variant="filled" value={isOpen}>
                <Accordion.Item value="header">
                    <Accordion.Control icon={<IconFilter size={16} />}>
                        Filtros
                    </Accordion.Control>
                    <Accordion.Panel>
                        <form onSubmit={form.onSubmit(onSubmitForm)}>
                            <Stack gap={'xs'}>
                                <Group>
                                    <DatePickerInput
                                        size="xs"
                                        label="Fecha"
                                        placeholder="Seleccione una fecha"
                                        valueFormat="DD/MM/YYYY"
                                        clearable
                                        {...form.getInputProps('fecha')}
                                    />
                                    <Select
                                        size="xs"
                                        label="Cancha"
                                        placeholder="Seleccione una cancha"
                                        data={canchaOptions}
                                        searchable
                                        clearable
                                        {...form.getInputProps('cancha_id')}
                                    />
                                    <Select
                                        size="xs"
                                        label="Jugador"
                                        placeholder="Seleccione un jugador"
                                        data={jugadorOptions}
                                        searchable
                                        clearable
                                        {...form.getInputProps('jugador_id')}
                                    />
                                </Group>
                                <Group>
                                    <Button size="xs" rightSection={<IconSearch size={16} />} type="submit" loading={loading}>
                                        Aplicar
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Paper>
    )
} 