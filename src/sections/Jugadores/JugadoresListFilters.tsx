import { useForm } from "@mantine/form";
import { Accordion, Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { Operator, type Filter } from "../../modules/SharedKernel/Domain/Criteria";
import { useSearchParams } from "react-router";
import { z } from "zod";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect } from "react";

export interface JugadoresFilters {
    nombre?: string | null
    apellido?: string | null
}


export interface JugadoresListFiltersProps {
    onSubmit: (values: Filter[]) => void
    loading?: boolean
}

export default function JugadoresListFilters({ onSubmit, loading }: JugadoresListFiltersProps) {
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
        nombre: z.string().optional(),
        apellido: z.string().optional()
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


    const onSubmitForm = (values: JugadoresFilters) => {
        const filters: Filter[] = []
        if (values.nombre?.trim()) {
            filters.push({
                field: 'nombre',
                operator: Operator.STARTS_WITH,
                value: values.nombre
            })
        }
        if (values.apellido?.trim()) {
            filters.push({
                field: 'apellido',
                operator: Operator.STARTS_WITH,
                value: values.apellido
            })
        }
        //setSearchParams({ q: JSON.stringify(values) })
        onSubmit(filters)
    }

    return <Paper shadow="xs" bg={'gray.0'} >
        <Accordion variant="filled" value={isOpen}>
            <Accordion.Item value="header">
                <Accordion.Control icon={<IconFilter size={16} />}>
                    Filtros
                </Accordion.Control>
                <Accordion.Panel>
                    <form onSubmit={form.onSubmit(onSubmitForm)}>
                        <Stack>
                            <Group>
                                <TextInput size="xs" label="Nombre" {...form.getInputProps('nombre')} />
                                <TextInput size="xs" label="Apellido" {...form.getInputProps('apellido')} />
                            </Group>
                            <Group>
                                <Button size="xs" rightSection={<IconSearch size={16} />} type="submit" loading={loading}>
                                    Aplicar
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Accordion.Panel>
            </Accordion.Item >
        </Accordion >
    </Paper>
}