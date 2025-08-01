import { AppShell, Burger, NavLink, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

export interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate()
    const location = useLocation()
    return <AppShell
        padding="xl"
        header={{ height: 60 }}
        navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
        }}

    >
        <AppShell.Header bg={'dark.8'}>
            <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
            />
            <Text c={'white'} fw={700} size="xl" p={'md'}>Gestión de canchas</Text>
        </AppShell.Header>
        <AppShell.Navbar>
            <NavLink
                active={location.pathname.startsWith('/reservas')}
                onClick={() => navigate('/reservas')}
                label={<Text fw={500}
                    size='lg'>
                    Reservas
                </Text>} />
            <NavLink
                active={location.pathname.startsWith('/jugadores')}
                onClick={() => navigate('/jugadores')}
                label={<Text fw={500}
                    size='lg'>Jugadores</Text>} />
            <NavLink
                active={location.pathname.startsWith('/canchas')}
                onClick={() => navigate('/canchas')}
                label={<Text fw={500}
                    size='lg'>Canchas</Text>} />

        </AppShell.Navbar>
        <AppShell.Main bg={'gray.1'}>
            {children}
        </AppShell.Main>
    </AppShell>
}