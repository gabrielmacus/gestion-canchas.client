import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode } from "react";

export interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [opened, { toggle }] = useDisclosure(false);
    return <AppShell>
        <AppShell.Header>
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <div>Logo</div>
        </AppShell.Header>
        <AppShell.Main>
            {children}
        </AppShell.Main>
    </AppShell>
}