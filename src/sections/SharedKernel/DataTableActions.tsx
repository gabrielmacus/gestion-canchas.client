import { Button, Group } from "@mantine/core"
import type { Icon } from "@tabler/icons-react"
import IconWrap from "./IconWrap"

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
                onClick={action.onClick}
                leftSection={action.icon && <IconWrap icon={action.icon} />}>
                {action.label}
            </Button>
        ))}
    </Group>
}