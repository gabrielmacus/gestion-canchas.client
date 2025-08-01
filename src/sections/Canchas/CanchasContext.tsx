import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cancha } from '../../modules/Canchas/Domain/Cancha';
import { CanchaApiRepository } from '../../modules/Canchas/Infraestructure/CanchaApiRepository';
import { CrearCancha } from '../../modules/Canchas/Application/CrearCancha';
import { EditarCancha } from '../../modules/Canchas/Application/EditarCancha';
import { EliminarCancha } from '../../modules/Canchas/Application/EliminarCancha';
import { ListarCanchasPaginados } from '../../modules/Canchas/Application/ListarCanchasPaginados';
import { Criteria } from '../../modules/SharedKernel/Domain/Criteria';
import { PaginatedResponse } from '../../modules/SharedKernel/Domain/PaginatedResponse';

interface CanchasContextType {
    canchas: Cancha[];
    loading: boolean;
    selectedCancha: Cancha | null;
    showForm: boolean;
    pagination: {
        page: number;
        pageSize: number;
        total: number;
    };
    loadCanchas: (criteria?: Criteria) => Promise<void>;
    createCancha: (cancha: Cancha) => Promise<void>;
    updateCancha: (cancha: Cancha) => Promise<void>;
    deleteCancha: (id: string) => Promise<void>;
    selectCancha: (cancha: Cancha | null) => void;
    toggleForm: () => void;
    setPage: (page: number) => void;
}

const CanchasContext = createContext<CanchasContextType | undefined>(undefined);

const repository = new CanchaApiRepository();
const crearCancha = new CrearCancha(repository);
const editarCancha = new EditarCancha(repository);
const eliminarCancha = new EliminarCancha(repository);
const listarCanchas = new ListarCanchasPaginados(repository);

interface CanchasProviderProps {
    children: ReactNode;
}

export function CanchasProvider({ children }: CanchasProviderProps) {
    const [canchas, setCanchas] = useState<Cancha[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0
    });

    const loadCanchas = async (criteria?: Criteria) => {
        setLoading(true);
        try {
            const defaultCriteria: Criteria = {
                page: pagination.page,
                limit: pagination.pageSize,
                ...criteria
            };
            const response: PaginatedResponse<Cancha> = await listarCanchas.execute(defaultCriteria);
            setCanchas(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } catch (error) {
            console.error('Error loading canchas:', error);
        } finally {
            setLoading(false);
        }
    };

    const createCancha = async (cancha: Cancha) => {
        try {
            await crearCancha.execute(cancha);
            await loadCanchas();
            setShowForm(false);
            setSelectedCancha(null);
        } catch (error) {
            console.error('Error creating cancha:', error);
        }
    };

    const updateCancha = async (cancha: Cancha) => {
        try {
            await editarCancha.execute(cancha);
            await loadCanchas();
            setShowForm(false);
            setSelectedCancha(null);
        } catch (error) {
            console.error('Error updating cancha:', error);
        }
    };

    const deleteCancha = async (id: string) => {
        try {
            await eliminarCancha.execute(id);
            await loadCanchas();
        } catch (error) {
            console.error('Error deleting cancha:', error);
        }
    };

    const selectCancha = (cancha: Cancha | null) => {
        setSelectedCancha(cancha);
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        if (showForm) {
            setSelectedCancha(null);
        }
    };

    const setPage = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const value: CanchasContextType = {
        canchas,
        loading,
        selectedCancha,
        showForm,
        pagination,
        loadCanchas,
        createCancha,
        updateCancha,
        deleteCancha,
        selectCancha,
        toggleForm,
        setPage
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
        throw new Error('useCanchas must be used within a CanchasProvider');
    }
    return context;
}