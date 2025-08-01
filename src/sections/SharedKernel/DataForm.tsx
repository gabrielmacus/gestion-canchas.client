import { Button, Group, LoadingOverlay, Paper, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from 'zod/v4';
import { zod4Resolver } from 'mantine-form-zod-resolver';

import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import RequestError from "../../modules/SharedKernel/Domain/RequestError";

export interface DataFormProps<T extends Record<string, any>> {
    onSubmit: (values: Partial<T>) => Promise<void>
    onValuesChange?: (values: Partial<T>) => void
    onSubmitError?: (error: unknown) => void
    initialValues?: T
    children: (form: ReturnType<typeof useForm<Partial<T>>>) => React.ReactNode
    title?: string
    schema: z.ZodSchema<Partial<T>>
    disableSubmit?: boolean
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
        },
        onValuesChange(values) {
            if (props.onValuesChange) {
                props.onValuesChange(values)
            }
        },
    })

    const onSubmit = async (values: Partial<T>) => {
        setIsLoading(true)
        try {
            await props.onSubmit(values)
        } catch (error) {
            let msg = "Error desconocido. Intente nuevamente"
            if (error instanceof RequestError) {
                msg = error.code == "422" ? "Error de validación. Revise los campos" : error.detail
            }

            notifications.show({
                title: 'Error',
                message: msg,
                color: 'red',
                position: 'bottom-center'
            })

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
                    <Button type="submit" disabled={props.disableSubmit}>Aceptar</Button>
                </Group>
            </Stack>
        </form>
        <LoadingOverlay overlayProps={{ radius: "sm", blur: 2, zIndex: 1000 }} visible={isLoading} />
    </Paper>
}