import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode } from "react";

export interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [opened, { toggle }] = useDisclosure(false);
    return <AppShell
        padding="xl"
        header={{ height: 60 }}
        navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
        }}

    >
        <AppShell.Header>
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <div>Logo</div>
        </AppShell.Header>
        <AppShell.Navbar>Navbar</AppShell.Navbar>
        <AppShell.Main bg={'gray.1'}>
            {children}
        </AppShell.Main>
    </AppShell>
}