import { createContext, useContext } from "react"
import createCanchaApiRepository from "../../modules/Canchas/Infraestructure/CanchaApiRepository"
import type CanchaRepository from "../../modules/Canchas/Domain/CanchaRepository"

export interface CanchasContextState {
    repository: CanchaRepository
}

export const CanchasContext = createContext({} as CanchasContextState)

interface CanchasContextProviderProps {
    children: React.ReactNode
}

export const CanchasContextProvider = (props: CanchasContextProviderProps) => {
    const repository = createCanchaApiRepository()
    return <CanchasContext.Provider value={{ repository }}>
        {props.children}
    </CanchasContext.Provider>
}

export const useCanchasContext = () => useContext(CanchasContext)
