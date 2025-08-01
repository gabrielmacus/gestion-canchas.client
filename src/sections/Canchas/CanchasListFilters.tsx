import React, { useState } from 'react';
import { useCanchas } from './CanchasContext';
import { Criteria } from '../../modules/SharedKernel/Domain/Criteria';

export default function CanchasListFilters() {
    const { loadCanchas } = useCanchas();
    const [filters, setFilters] = useState({
        nombre: '',
        techada: ''
    });

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        const criteria: Criteria = {
            page: 1,
            limit: 10
        };

        if (filters.nombre) {
            criteria.filters = {
                ...criteria.filters,
                nombre: filters.nombre
            };
        }

        if (filters.techada !== '') {
            criteria.filters = {
                ...criteria.filters,
                techada: filters.techada === 'true'
            };
        }

        loadCanchas(criteria);
    };

    const handleClear = () => {
        setFilters({
            nombre: '',
            techada: ''
        });
        loadCanchas();
    };

    return (
        <div className="filters-container">
            <h3>Filtros</h3>
            
            <div className="filter-field">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    id="nombre"
                    type="text"
                    value={filters.nombre}
                    onChange={(e) => handleFilterChange('nombre', e.target.value)}
                    placeholder="Buscar por nombre..."
                />
            </div>

            <div className="filter-field">
                <label htmlFor="techada">Techada:</label>
                <select
                    id="techada"
                    value={filters.techada}
                    onChange={(e) => handleFilterChange('techada', e.target.value)}
                >
                    <option value="">Todas</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div className="filter-actions">
                <button onClick={handleSearch}>Buscar</button>
                <button onClick={handleClear}>Limpiar</button>
            </div>
        </div>
    );
}