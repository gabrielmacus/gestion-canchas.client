import { TextInput, Switch } from "@mantine/core";
import MainLayout from "../SharedKernel/Layouts/MainLayout";
import DataForm from "../SharedKernel/DataForm";
import type { Cancha } from "../../modules/Canchas/Domain/Cancha";
import { useCanchasContext } from "./CanchasContext";
import CrearCancha from "../../modules/Canchas/Application/CrearCancha";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import EditarCancha from "../../modules/Canchas/Application/EditarCancha";
import CanchaSchema from "./CanchaSchema";


export interface CanchasSaveProps {
}

export default function CanchasSave(_: CanchasSaveProps) {
    const { id } = useParams()
    const { repository } = useCanchasContext()
    const navigate = useNavigate()
    const query = useQuery<Cancha | null>({
        queryKey: ['cancha', id],
        queryFn: () => id ? repository.getById(id) : null
    })
    const initialValues = query.data ?? undefined
    const title = id ? 'Editar cancha' : 'Nueva cancha'

    const onSubmit = async (values: Partial<Cancha>) => {

        if (id) {
            await EditarCancha(repository, values, id)
        } else {
            await CrearCancha(repository, values as Cancha)
        }
        navigate('/canchas')
    }

    return <MainLayout>
        <DataForm
            title={title}
            onSubmit={onSubmit}
            initialValues={initialValues}
            schema={CanchaSchema}
            onSubmitError={(error) => {
                console.error(error)
            }}
        >
            {(form) => <>
                <TextInput required key={form.key('nombre')} label='Nombre' {...form.getInputProps('nombre')} />
                <Switch
                    label='Cancha techada'
                    //checked={form.values.techada}
                    //onChange={(event) => {
                    //    form.setFieldValue('techada', event.target.checked)
                    //}}
                    key={form.key('techada')}

                    {...form.getInputProps('techada', {
                        type: 'checkbox'
                    })}

                />
            </>}
        </DataForm>

    </MainLayout>
} 