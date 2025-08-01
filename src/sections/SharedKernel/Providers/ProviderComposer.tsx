import React from 'react'

type Provider = React.ComponentType<{ children: React.ReactNode }>

/**
 * Compone múltiples providers en uno solo, eliminando la anidación
 */
export function composeProviders(...providers: Provider[]): Provider {
    return ({ children }) =>
        // Itera los elementos, anidando uno adentro del otro de manera recursiva
        providers.reduceRight(
            (acc, Provider) => <Provider>{acc}</Provider>,
            children as React.ReactElement
        )
}

/**
 * Hook para crear un provider compuesto de manera más legible
 */
export function createComposedProvider(providers: Provider[]) {
    const ComposedProvider = composeProviders(...providers)

    return ({ children }: { children: React.ReactNode }) => (
        <ComposedProvider>{children}</ComposedProvider>
    )
} 