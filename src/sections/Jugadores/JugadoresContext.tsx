import { createContext, useContext } from "react"
import { createJugadorApiRepository } from "../../modules/Jugadores/Infraestructure/JugadorApiRepository"
import type JugadorRepository from "../../modules/Jugadores/Domain/JugadorRepository"

export interface JugadoresContextState {
    repository: JugadorRepository
}

export const JugadoresContext = createContext({} as JugadoresContextState)

interface JugadoresContextProviderProps {
    children: React.ReactNode
}

export const JugadoresContextProvider = (props: JugadoresContextProviderProps) => {
    const repository = createJugadorApiRepository()
    return <JugadoresContext.Provider value={{ repository }}>
        {props.children}
    </JugadoresContext.Provider>
}

export const useJugadoresContext = () => useContext(JugadoresContext)