import { Select, NumberInput, Group, Modal, ActionIcon, Input, Stack, Button, Box, Slider } from "@mantine/core";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import DataForm from "../SharedKernel/DataForm";
import type { Reserva } from "../../modules/Reservas/Domain/Reserva";
import type { Cancha } from "../../modules/Canchas/Domain/Cancha";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import { useReservasContext } from "./ReservasContext";
import { useCanchasContext } from "../Canchas/CanchasContext";
import { useJugadoresContext } from "../Jugadores/JugadoresContext";
import {
    CrearReserva,
    EditarReserva,
    CrearReservaSchema,
    EditarReservaSchema,
    type CrearReservaData,
    type EditarReservaData
} from "../../modules/Reservas/Application";
import ListarCanchasPaginadas from "../../modules/Canchas/Application/ListarCanchasPaginadas";
import { ListarJugadoresPaginados } from "../../modules/Jugadores/Application/ListarJugadoresPaginados";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { DateTimePicker, getTimeRange, TimeGrid } from '@mantine/dates';
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import JugadoresSaveForm from "../Jugadores/JugadoresSaveForm";
import { ListarReservasPaginadas } from "../../modules/Reservas/Application/ListarReservasPaginadas";
import { useMemo, useState } from "react";

export interface ReservasSaveProps { }

export default function ReservasSave(_: ReservasSaveProps) {
    const { id } = useParams()
    const { repository: reservaRepository } = useReservasContext()
    const { repository: canchaRepository } = useCanchasContext()
    const { repository: jugadorRepository } = useJugadoresContext()
    const [openedJugadorModal, { open: openJugadorModal, close: closeJugadorModal }] = useDisclosure(false);
    const navigate = useNavigate()

    const reservaQuery = useQuery<Reserva | null>({
        queryKey: ['reserva', id],
        queryFn: () => id ? reservaRepository.getById(id) : null
    })

    const canchasQuery = useQuery<PaginatedResponse<Cancha>>({
        queryKey: ['canchas-all'],
        queryFn: () => ListarCanchasPaginadas(canchaRepository, {
            filters: [],
            pagination: { page: 1, size: 1000 },
            orders: [{
                field: 'nombre',
                direction: 'asc'
            }]
        })
    })

    const jugadoresQuery = useQuery<PaginatedResponse<Jugador>>({
        queryKey: ['jugadores-all'],
        queryFn: () => ListarJugadoresPaginados(jugadorRepository, {
            filters: [],
            pagination: { page: 1, size: 1000 },
            orders: [{
                field: 'id',
                direction: 'desc'
            }]
        })
    })

    const initialValues = useMemo(() => reservaQuery.data ? {
        ...reservaQuery.data,
        // Convertir la fecha para mostrar en el formulario
        fecha_hora: dayjs(reservaQuery.data.fecha_hora).format("YYYY-MM-DDTHH:mm:ss")
    } : { duracion: 60 }, [reservaQuery.data])

    const title = id ? 'Editar reserva' : 'Nueva reserva'

    // Usar el schema apropiado según si es crear o editar
    const schema = id ? EditarReservaSchema : CrearReservaSchema;

    const onSubmit = async (values: CrearReservaData | EditarReservaData) => {
        if (id) {
            await EditarReserva(reservaRepository, values as EditarReservaData, id)
        } else {
            await CrearReserva(reservaRepository, values as CrearReservaData)
        }
        navigate('/reservas')
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
        <MainLayout>
            <Modal opened={openedJugadorModal} onClose={closeJugadorModal}>
                <JugadoresSaveForm afterSubmit={() => {
                    closeJugadorModal()
                    jugadoresQuery.refetch()
                }} />
            </Modal>
            <DataForm
                title={title}
                onSubmit={onSubmit}
                initialValues={initialValues}
                schema={schema}
                onSubmitError={(error) => {
                    console.error(error)
                }}
            >
                {(form) => (
                    <>
                        <Select
                            required={!id}
                            label="Cancha"
                            placeholder="Seleccione una cancha"
                            data={canchaOptions}
                            searchable
                            key={form.key('cancha_id')}
                            {...form.getInputProps('cancha_id')}

                        />
                        <Stack gap={'xs'}>
                            <Select
                                required={!id}
                                label="Jugador"
                                placeholder="Seleccione un jugador"
                                data={jugadorOptions}
                                searchable
                                key={form.key('jugador_id')}
                                {...form.getInputProps('jugador_id')}
                            />
                            <Box>
                                <Button
                                    size="xs"
                                    variant="outline"
                                    leftSection={<IconPlus />}
                                    onClick={openJugadorModal}
                                >
                                    Nuevo jugador
                                </Button>
                            </Box>
                        </Stack>

                        <DateTimePicker
                            required={!id}
                            label="Fecha/hora"
                            placeholder="Selecciona fecha y hora"
                            valueFormat="DD/MM/YYYY HH:mm"
                            description="La hora debe ser exacta (sin minutos ni segundos)"

                            timePickerProps={{
                                withDropdown: true,
                                popoverProps: { withinPortal: false },
                                format: '24h',
                                minutesStep: 60
                            }}

                            key={form.key('fecha_hora')}
                            {...form.getInputProps('fecha_hora')}
                        />

                        <Input.Wrapper 
                            label="Duración"
                            description="Duración de la reserva en horas (mínimo 1 hora, máximo 4 horas)"
                            error={form.errors.duracion}
                        >
                            <Slider
                                defaultValue={60}
                                w={'95%'} mx="auto"
                                key={form.key('duracion')}
                                step={60}
                                min={60}
                                max={240}
                                showLabelOnHover={false}
                                marks={[
                                    { value: 60, label: '1 hora' },
                                    { value: 120, label: '2 horas' },
                                    { value: 180, label: '3 horas' },
                                    { value: 240, label: '4 horas' },
                                ]}
                                {...form.getInputProps('duracion')}
                            />
                        </Input.Wrapper>
                    </>
                )}
            </DataForm>
        </MainLayout >
    )
} 