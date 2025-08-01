import { AppShell, Burger, Grid, Group, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

export interface MainLayoutProps {
    children: ReactNode;
}

interface NavbarProps {
    items: {
        label: string;
        href: string;
    }[]
}

function Navbar({ items }: NavbarProps) {
    const location = useLocation()
    const navigate = useNavigate()
    return <AppShell.Navbar>
        {items.map((item) => (
            <NavLink
                key={item.href}
                active={location.pathname.startsWith(item.href)}
                onClick={() => navigate(item.href)}
                label={<Text fw={500}
                    size='md'>
                    {item.label}
                </Text>} />
        ))}
    </AppShell.Navbar>
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
        <AppShell.Header bg={'dark.8'}>
            <Group justify="space-between">
                <Burger
                    color='white'
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Text c={'white'} fw={700} size="xl" p={'md'}>Gestión de canchas</Text>
            </Group>
        </AppShell.Header>
        <AppShell.Navbar>
            <Navbar items={[
                { label: 'Reservas', href: '/reservas' },
                { label: 'Jugadores', href: '/jugadores' },
                { label: 'Canchas', href: '/canchas' }]} />
        </AppShell.Navbar>
        <AppShell.Main bg={'gray.1'}>
            {children}
        </AppShell.Main>
    </AppShell>
}