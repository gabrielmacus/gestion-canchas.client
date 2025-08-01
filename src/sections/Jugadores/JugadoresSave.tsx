import MainLayout from "../SharedKernel/Layouts/MainLayout";
import JugadoresSaveForm from "./JugadoresSaveForm";

export interface JugadoresSaveProps {
    afterSubmit?: () => void;
}

export default function JugadoresSave(props: JugadoresSaveProps) {
    return (
        <MainLayout>
            <JugadoresSaveForm afterSubmit={props.afterSubmit} />
        </MainLayout>
    );
}