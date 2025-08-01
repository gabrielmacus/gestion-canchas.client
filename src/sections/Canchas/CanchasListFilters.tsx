import { useForm } from "@mantine/form";
import { Accordion, Button, Group, Paper, Stack, TextInput, Select } from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { Operator, type Filter } from "../../modules/SharedKernel/Domain/Criteria";
import { useSearchParams } from "react-router";
import { z } from "zod";
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useEffect } from "react";

export interface CanchasFilters {
    nombre?: string | null
    techada?: string | null
}


export interface CanchasListFiltersProps {
    onSubmit: (values: Filter[]) => void
    loading?: boolean
}

export default function CanchasListFilters({ onSubmit, loading }: CanchasListFiltersProps) {
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
        nombre: z.string().nullish(),
        techada: z.string().nullish()
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


    const onSubmitForm = (values: CanchasFilters) => {
        const filters: Filter[] = []
        if (values.nombre?.trim()) {
            filters.push({
                field: 'nombre',
                operator: Operator.STARTS_WITH,
                value: values.nombre
            })
        }
        if (values.techada && values.techada !== '') {
            filters.push({
                field: 'techada',
                operator: Operator.EQ,
                value: values.techada
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
                        <Stack gap={'xs'}>
                            <Group>
                                <TextInput size="xs" label="Nombre" {...form.getInputProps('nombre')} />
                                <Select
                                    size="xs"
                                    label="Techada"
                                    placeholder="Seleccione..."
                                    data={[
                                        { value: 'true', label: 'Sí' },
                                        { value: 'false', label: 'No' }
                                    ]}
                                    clearable
                                    {...form.getInputProps('techada')}
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
            </Accordion.Item >
        </Accordion >
    </Paper>
} 