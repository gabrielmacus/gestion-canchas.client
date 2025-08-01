import { ActionIcon, Menu, Text } from "@mantine/core"
import { IconDots } from "@tabler/icons-react"
import type { Icon } from "@tabler/icons-react"
import IconWrap from "./IconWrap"

export interface DataRowAction<T> {
    label: string
    icon?: Icon
    onClick: (rowItem: T) => void | Promise<void>
}

export interface DataRowActionsProps<T> {
    actions: DataRowAction<T>[]
    rowItem: T
}

export default function DataRowActions<T>({ actions, rowItem }: DataRowActionsProps<T>) {
    return <Menu position="bottom" shadow="md" withArrow>
        <Menu.Target>
            <ActionIcon
                variant="subtle"
                size="sm"
            >
                <IconDots />
            </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
            {actions.map((action) => (
                <Menu.Item
                    leftSection={action.icon && <IconWrap size={16} icon={action.icon} />}
                    key={action.label}
                    onClick={() => action.onClick(rowItem)}
                >
                    <Text size="xs">{action.label}</Text>
                </Menu.Item>
            ))}
        </Menu.Dropdown>
    </Menu>
}