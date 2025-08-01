import { Select, Modal, Input, Stack, Button, Box, Slider, LoadingOverlay } from "@mantine/core";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import DataForm from "../SharedKernel/DataForm";
import type { Reserva } from "../../modules/Reservas/Domain/Reserva";
import type { Cancha } from "../../modules/Canchas/Domain/Cancha";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import type PaginatedResponse from "../../modules/SharedKernel/Domain/PaginatedResponse";
import { useReservasContext } from "./ReservasContext";
import { useCanchasContext } from "../Canchas/CanchasContext";
import { useJugadoresContext } from "../Jugadores/JugadoresContext";
import CrearReserva from "../../modules/Reservas/Application/CrearReserva";
import EditarReserva from "../../modules/Reservas/Application/EditarReserva";
import ListarCanchasPaginadas from "../../modules/Canchas/Application/ListarCanchasPaginadas";
import { ListarJugadoresPaginados } from "../../modules/Jugadores/Application/ListarJugadoresPaginados";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { DateTimePicker } from '@mantine/dates';
import ReservaSchema from "./ReservaSchema";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import JugadoresSaveForm from "../Jugadores/JugadoresSaveForm";
//import { ListarReservasPaginadas } from "../../modules/Reservas/Application/ListarReservasPaginadas";
import { useMemo } from "react";
import EntityToEditNotFoundAlert from "../SharedKernel/EntityToEditNotFoundAlert";

export interface ReservasSaveProps { }

export default function ReservasSave(_: ReservasSaveProps) {
    const { id } = useParams()
    const { repository: reservaRepository } = useReservasContext()
    const { repository: canchaRepository } = useCanchasContext()
    const { repository: jugadorRepository } = useJugadoresContext()
    const [openedJugadorModal, { open: openJugadorModal, close: closeJugadorModal }] = useDisclosure(false);
    //const [values, setValues] = useState<Partial<Reserva>>({})
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

    /*
    const reservasExistentesQuery = useQuery<PaginatedResponse<Reserva>>({
        queryKey: ['reservas-existentes'],
        queryFn: () => ListarReservasPaginadas(reservaRepository, {
            filters: [{
                field: 'cancha_id',
                operator: 'eq',
                value: cancha_id
            }],
            pagination: { page: 1, size: 1000 },
        })
    })*/

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
        //TODO: Unificar el asunto de la zona horaria
        fecha_hora: dayjs(reservaQuery.data.fecha_hora).add(-3, 'hours').format("YYYY-MM-DD HH:mm:ss")
    } : { duracion: 60 }, [reservaQuery.data])

    const title = id ? 'Editar reserva' : 'Nueva reserva'

    const schema = ReservaSchema

    const onSubmit = async (values: Partial<Reserva>) => {
        if (id) {
            await EditarReserva(reservaRepository, values, id)
        } else {
            await CrearReserva(reservaRepository, values as Omit<Reserva, 'id'>)
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
            <Box pos="relative">

                <Modal opened={openedJugadorModal} onClose={closeJugadorModal}>
                    <JugadoresSaveForm afterSubmit={() => {
                        closeJugadorModal()
                        jugadoresQuery.refetch()
                    }} />
                </Modal>
                <DataForm
                    //onValuesChange={setValues}
                    disableSubmit={reservaQuery.isError}
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
                                required
                                label="Cancha"
                                placeholder="Seleccione una cancha"
                                data={canchaOptions}
                                searchable
                                key={form.key('cancha_id')}
                                {...form.getInputProps('cancha_id')}

                            />
                            <Stack gap={'xs'}>
                                <Select
                                    required
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
                                required
                                label="Fecha/hora"
                                placeholder="Selecciona fecha y hora"
                                valueFormat="DD/MM/YYYY HH:mm"

                                timePickerProps={{
                                    withDropdown: true,
                                    popoverProps: { withinPortal: false },
                                    format: '24h',
                                    minutesStep: 60
                                }}

                                key={form.key('fecha_hora')}
                                {...form.getInputProps('fecha_hora')}
                            />

                            {/* <TimeGrid
                            data={getTimeRange({ startTime: '08:00', endTime: '23:00', interval: '01:00' })}
                        /> */}

                            <Input.Wrapper label="Duracion"
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
                <LoadingOverlay visible={reservaQuery.isLoading} />
                {reservaQuery.error && <EntityToEditNotFoundAlert mt="xl" />}
            </Box>
        </MainLayout >
    )
} 