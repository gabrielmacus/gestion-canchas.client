import { TextInput } from "@mantine/core";
import DataForm from "../SharedKernel/DataForm";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import { useJugadoresContext } from "./JugadoresContext";
import { CrearJugador } from "../../modules/Jugadores/Application/CrearJugador";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import EditarJugador from "../../modules/Jugadores/Application/EditarJugador";
import CrearJugadorSchema from "../../modules/Jugadores/Application/CrearJugadorSchema";
import EditarJugadorSchema from "../../modules/Jugadores/Application/EditarJugadorSchema";

export interface JugadoresSaveFormProps {
    afterSubmit?: () => void;
    jugadorId?: string;
}

export default function JugadoresSaveForm(props: JugadoresSaveFormProps) {
    const { id: routeId } = useParams();
    const id = props.jugadorId ?? routeId;
    const { repository } = useJugadoresContext();
    const navigate = useNavigate();

    const query = useQuery<Jugador | null>({
        queryKey: ['jugador', id],
        queryFn: () => id ? repository.getById(id) : null
    });

    const initialValues = query.data ?? undefined;
    const title = id ? 'Editar jugador' : 'Nuevo jugador';

    const schema = id ? EditarJugadorSchema : CrearJugadorSchema;

    const onSubmit = async (values: Partial<Jugador>) => {
        if (id) {
            await EditarJugador(repository, values, id);
        } else {
            await CrearJugador(repository, values as Jugador);
        }

        if (props.afterSubmit) {
            props.afterSubmit();
        } else {
            navigate('/jugadores');
        }
    };

    return (
        <DataForm
            title={title}
            onSubmit={onSubmit}
            initialValues={initialValues}
            schema={schema}
            onSubmitError={(error) => {
                console.error(error);
            }}
        >
            {(form) => (
                <>
                    <TextInput required label='Nombre' {...form.getInputProps('nombre')} />
                    <TextInput required label='Apellido' {...form.getInputProps('apellido')} />
                    <TextInput required label='Teléfono' {...form.getInputProps('telefono')} />
                    <TextInput label='Email' {...form.getInputProps('email')} />
                </>
            )}
        </DataForm>
    );
}
