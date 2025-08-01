import { createContext, useContext } from "react"
import createReservaApiRepository from "../../modules/Reservas/Infraestructure/ReservaApiRepository"
import type ReservaRepository from "../../modules/Reservas/Domain/ReservaRepository"

export interface ReservasContextState {
    repository: ReservaRepository
}

export const ReservasContext = createContext({} as ReservasContextState)

interface ReservasContextProviderProps {
    children: React.ReactNode
}

export const ReservasContextProvider = (props: ReservasContextProviderProps) => {
    const repository = createReservaApiRepository()
    return <ReservasContext.Provider value={ { repository } }>
        { props.children }
        </ReservasContext.Provider>
}

export const useReservasContext = () => useContext(ReservasContext)
