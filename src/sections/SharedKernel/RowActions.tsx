import { IconEdit, IconTrash } from "@tabler/icons-react"
import type { NavigateFunction } from "react-router"
import type { DataRowAction } from "./DataRowActions"
import type BaseEntity from "../../modules/SharedKernel/Domain/BaseEntity"
import { modals } from "@mantine/modals"
import { Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"

export function EditRowAction<T extends BaseEntity>(module: string, navigate: NavigateFunction): DataRowAction<T> {
    return {
        label: "Editar",
        icon: IconEdit,
        onClick: (rowItem) => {
            navigate(`/${module}/edit/${rowItem.id}`)
        }
    }
}

export function DeleteRowAction<T extends BaseEntity>(
    confirmMessage?: string,
    onConfirm?: (rowItem: T) => void
): DataRowAction<T> {
    return {
        label: "Eliminar",
        icon: IconTrash,
        onClick: (rowItem) => {
            modals.openConfirmModal({
                title: "Eliminar",
                children: <Text>{confirmMessage ?? '¿Desea eliminar este registro?'}</Text>,
                labels: {
                    confirm: "Confirmar",
                    cancel: "Cancelar"
                },
                onConfirm: async () => {
                    try {
                        await onConfirm?.(rowItem)
                    } catch (error) {
                        console.error(error)
                        notifications.show({
                            title: 'Error',
                            message: 'Ocurrió un error al ejecutar la acción. Compruebe que los datos sean correctos e intente nuevamente',
                            color: 'red'
                        })
                    }
                }
            })
        }
    }
}