import { Button, Checkbox, Group, LoadingOverlay, Paper, Stack, Text } from "@mantine/core";
import { useForm, type FormValidateInput } from "@mantine/form";
import { z } from 'zod/v4';
import { zod4Resolver } from 'mantine-form-zod-resolver';

import { useEffect, useState } from "react";

export interface DataFormProps<T extends Record<string, any>> {
    onSubmit: (values: Partial<T>) => Promise<void>
    onSubmitError?: (error: unknown) => void
    initialValues?: T
    children: (form: ReturnType<typeof useForm<Partial<T>>>) => React.ReactNode
    title?: string
    schema: z.ZodSchema<Partial<T>>
}

export default function DataForm<T extends Record<string, any>>(props: DataFormProps<Partial<T>>) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<Partial<T>>({
        mode: 'uncontrolled',
        initialValues: props.initialValues,
        validate: zod4Resolver(props.schema),
        validateInputOnChange: true,
        transformValues: (values) => {
            return props.schema.parse(values)
        }
    })

    const onSubmit = async (values: Partial<T>) => {
        setIsLoading(true)
        try {
            await props.onSubmit(values)
        } catch (error) {
            props.onSubmitError?.(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (props.initialValues) {
            form.setValues(props.initialValues)
        }
    }, [props.initialValues])

    return <Paper pos="relative" shadow="sm" p="lg" maw={768}>
        {props.title && <Text fw={600} size="lg" mb={'xs'} >{props.title}</Text>}
        <form onSubmit={
            form.onSubmit(onSubmit)
        } >
            <Stack gap={'xl'} >
                <Stack gap={'sm'}>
                    {props.children(form)}
                </Stack>
                <Group>
                    <Button type="submit">Aceptar</Button>
                </Group>
            </Stack>
        </form>
        <LoadingOverlay overlayProps={{ radius: "sm", blur: 2, zIndex: 1000 }} visible={isLoading} />
    </Paper>
}