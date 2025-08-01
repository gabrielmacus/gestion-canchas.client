import type { Icon } from "@tabler/icons-react"

export interface IconWrapProps {
    icon: Icon
    size?: number
}

export default function IconWrap({ icon, size }: IconWrapProps) {
    const IconComponent = icon
    return <IconComponent size={size} />
}