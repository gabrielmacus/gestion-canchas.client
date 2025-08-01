import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { JugadoresContextProvider } from '../../Jugadores/JugadoresContext'
import { createComposedProvider } from './ProviderComposer'
import { HashRouter } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { CanchasContextProvider } from '../../Canchas/CanchasContext';
import { ReservasContextProvider } from '../../Reservas/ReservasContext';
import { DatesProvider } from '@mantine/dates';

import 'dayjs/locale/es';

const queryClient = new QueryClient()

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

const LocalDatesProvider = ({ children }: { children: React.ReactNode }) => (
    <DatesProvider settings={{
        locale: 'es',
        firstDayOfWeek: 1
    }}>
        {children}
    </DatesProvider>
)

const providers = [
    HashRouter,
    MantineProvider,
    ModalsProvider,
    ReactQueryProvider,
    LocalDatesProvider,
    JugadoresContextProvider,
    CanchasContextProvider,
    ReservasContextProvider
]

export const AppProviders = createComposedProvider(providers) 