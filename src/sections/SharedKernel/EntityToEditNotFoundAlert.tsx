import { Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"

export interface EntityToEditNotFoundAlertProps {
    mt?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function EntityToEditNotFoundAlert({ mt }: EntityToEditNotFoundAlertProps) {
    return <Alert variant="light" color="red" title="No se encontró el registro" icon={<IconAlertCircle />} mt={mt}>
        No se pudo acceder al registro que está intentando editar. Por favor, verifique que el ID sea correcto e intente nuevamente. Si el problema persiste, contacte al administrador.
    </Alert>
}