import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { JugadoresContextProvider } from '../../Jugadores/JugadoresContext'
import { createComposedProvider } from './ProviderComposer'
import { BrowserRouter } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { CanchasContextProvider } from '../../Canchas/CanchasContext';


const queryClient = new QueryClient()

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)

const providers = [
    BrowserRouter,
    MantineProvider,
    ModalsProvider,
    ReactQueryProvider,
    JugadoresContextProvider,
    CanchasContextProvider
]

export const AppProviders = createComposedProvider(providers) 