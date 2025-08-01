import { Button, Group } from "@mantine/core"
import type { Icon } from "@tabler/icons-react"
import IconWrap from "./IconWrap"
import { notifications } from "@mantine/notifications"

export interface DataTableAction {
    label: string
    icon?: Icon
    onClick: () => void | Promise<void>
}

export interface DataTableActionsProps {
    actions: DataTableAction[]
}

export default function DataTableActions({ actions }: DataTableActionsProps) {
    return <Group>
        {actions.map((action) => (
            <Button key={action.label}
                onClick={() => {
                    try {
                        action.onClick()
                    } catch (error) {
                        console.error(error)
                        notifications.show({
                            title: 'Error',
                            message: 'Ocurrió un error al ejecutar la acción. Compruebe que los datos sean correctos e intente nuevamente',
                            color: 'red'
                        })
                    }
                }}
                leftSection={action.icon && <IconWrap icon={action.icon} />}>
                {action.label}
            </Button>
        ))}
    </Group>
}