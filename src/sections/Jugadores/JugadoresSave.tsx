import { TextInput } from "@mantine/core";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import DataForm from "../SharedKernel/DataForm";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import { useJugadoresContext } from "./JugadoresContext";
import { CrearJugador } from "../../modules/Jugadores/Application/CrearJugador";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import EditarJugador from "../../modules/Jugadores/Application/EditarJugador";
import { z } from "zod";


export interface JugadoresSaveProps {
}

export default function JugadoresSave(_: JugadoresSaveProps) {
    const { id } = useParams()
    const { repository } = useJugadoresContext()
    const navigate = useNavigate()
    const query = useQuery<Jugador | null>({
        queryKey: ['jugador', id],
        queryFn: () => id ? repository.getById(id) : null
    })
    const initialValues = query.data ?? undefined
    const title = id ? 'Editar jugador' : 'Nuevo jugador'

    const schema = z.object({
        nombre: z.string().min(1),
        apellido: z.string().min(1),
        telefono: z.string().min(1),
        email: z.preprocess(val => val == '' ? null : val, z.string().nullish())
    })

    const onSubmit = async (values: Partial<Jugador>) => {

        if (id) {
            await EditarJugador(repository, values, id)
        } else {
            await CrearJugador(repository, values as Jugador)
        }
        navigate('/jugadores')
    }

    return <MainLayout>
        <DataForm
            title={title}
            onSubmit={onSubmit}
            initialValues={initialValues}
            schema={schema}
            onSubmitError={(error) => {
                console.error(error)
            }}
        >
            {(form) => <>
                <TextInput required label='Nombre' {...form.getInputProps('nombre')} />
                <TextInput required label='Apellido' {...form.getInputProps('apellido')} />
                <TextInput required label='Teléfono' {...form.getInputProps('telefono')} />
                <TextInput label='Email' {...form.getInputProps('email')} />
            </>}
        </DataForm>

    </MainLayout>
}