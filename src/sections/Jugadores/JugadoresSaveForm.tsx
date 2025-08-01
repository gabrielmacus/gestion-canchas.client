import { TextInput } from "@mantine/core";
import DataForm from "../SharedKernel/DataForm";
import type { Jugador } from "../../modules/Jugadores/Domain/Jugador";
import { useJugadoresContext } from "./JugadoresContext";
import { 
    CrearJugador, 
    EditarJugador,
    CrearJugadorSchema,
    EditarJugadorSchema,
    type CrearJugadorData,
    type EditarJugadorData
} from "../../modules/Jugadores/Application";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

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

    // Usar el schema apropiado según si es crear o editar
    const schema = id ? EditarJugadorSchema : CrearJugadorSchema;

    const onSubmit = async (values: CrearJugadorData | EditarJugadorData) => {
        if (id) {
            await EditarJugador(repository, values as EditarJugadorData, id);
        } else {
            await CrearJugador(repository, values as CrearJugadorData);
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
                    <TextInput 
                        required={!id} 
                        label='Nombre' 
                        placeholder="Ingrese el nombre del jugador"
                        {...form.getInputProps('nombre')} 
                    />
                    <TextInput 
                        required={!id} 
                        label='Apellido' 
                        placeholder="Ingrese el apellido del jugador"
                        {...form.getInputProps('apellido')} 
                    />
                    <TextInput 
                        required={!id} 
                        label='Teléfono' 
                        placeholder="Ingrese el número de teléfono"
                        {...form.getInputProps('telefono')} 
                    />
                    <TextInput 
                        label='Email' 
                        placeholder="Ingrese el email (opcional)"
                        {...form.getInputProps('email')} 
                    />
                </>
            )}
        </DataForm>
    );
}
