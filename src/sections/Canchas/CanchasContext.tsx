import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Cancha } from '../../modules/Canchas/Domain/Cancha';
import { PaginatedResponse } from '../../modules/SharedKernel/Domain/PaginatedResponse';
import { Criteria } from '../../modules/SharedKernel/Domain/Criteria';
import { CrearCancha } from '../../modules/Canchas/Application/CrearCancha';
import { EditarCancha } from '../../modules/Canchas/Application/EditarCancha';
import { EliminarCancha } from '../../modules/Canchas/Application/EliminarCancha';
import { ListarCanchasPaginados } from '../../modules/Canchas/Application/ListarCanchasPaginados';
import { CanchaApiRepository } from '../../modules/Canchas/Infraestructure/CanchaApiRepository';

interface CanchasContextType {
    canchas: PaginatedResponse<Cancha> | null;
    loading: boolean;
    error: string | null;
    cargarCanchas: (criteria: Criteria) => Promise<void>;
    crearCancha: (cancha: Omit<Cancha, 'id'>) => Promise<void>;
    editarCancha: (id: string, cancha: Partial<Cancha>) => Promise<void>;
    eliminarCancha: (id: string) => Promise<void>;
}

const CanchasContext = createContext<CanchasContextType | undefined>(undefined);

// Configuración de dependencias
const canchaRepository = new CanchaApiRepository();
const crearCanchaUseCase = new CrearCancha(canchaRepository);
const editarCanchaUseCase = new EditarCancha(canchaRepository);
const eliminarCanchaUseCase = new EliminarCancha(canchaRepository);
const listarCanchasUseCase = new ListarCanchasPaginados(canchaRepository);

interface CanchasProviderProps {
    children: ReactNode;
}

export function CanchasProvider({ children }: CanchasProviderProps) {
    const [canchas, setCanchas] = useState<PaginatedResponse<Cancha> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarCanchas = useCallback(async (criteria: Criteria) => {
        try {
            setLoading(true);
            setError(null);
            const result = await listarCanchasUseCase.ejecutar(criteria);
            setCanchas(result);
        } catch (err) {
            setError('Error al cargar las canchas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const crearCancha = useCallback(async (cancha: Omit<Cancha, 'id'>) => {
        try {
            setLoading(true);
            setError(null);
            await crearCanchaUseCase.ejecutar(cancha);
            // Recargar la lista después de crear
            if (canchas) {
                await cargarCanchas({ page: 1, limit: canchas.limit });
            }
        } catch (err) {
            setError('Error al crear la cancha');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [canchas, cargarCanchas]);

    const editarCancha = useCallback(async (id: string, cancha: Partial<Cancha>) => {
        try {
            setLoading(true);
            setError(null);
            await editarCanchaUseCase.ejecutar(id, cancha);
            // Recargar la lista después de editar
            if (canchas) {
                await cargarCanchas({ page: canchas.page, limit: canchas.limit });
            }
        } catch (err) {
            setError('Error al editar la cancha');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [canchas, cargarCanchas]);

    const eliminarCancha = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await eliminarCanchaUseCase.ejecutar(id);
            // Recargar la lista después de eliminar
            if (canchas) {
                await cargarCanchas({ page: canchas.page, limit: canchas.limit });
            }
        } catch (err) {
            setError('Error al eliminar la cancha');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [canchas, cargarCanchas]);

    const value: CanchasContextType = {
        canchas,
        loading,
        error,
        cargarCanchas,
        crearCancha,
        editarCancha,
        eliminarCancha,
    };

    return (
        <CanchasContext.Provider value={value}>
            {children}
        </CanchasContext.Provider>
    );
}

export function useCanchas() {
    const context = useContext(CanchasContext);
    if (context === undefined) {
        throw new Error('useCanchas debe ser usado dentro de un CanchasProvider');
    }
    return context;
}