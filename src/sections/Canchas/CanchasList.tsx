import React, { useEffect } from 'react';
import { useCanchas } from './CanchasContext';
import { DataTable } from '../SharedKernel/DataTable';
import { DataPagination } from '../SharedKernel/DataPagination';
import { DataTableActions } from '../SharedKernel/DataTableActions';
import { DataRowActions } from '../SharedKernel/DataRowActions';

export default function CanchasList() {
    const {
        canchas,
        loading,
        pagination,
        loadCanchas,
        deleteCancha,
        selectCancha,
        toggleForm,
        setPage
    } = useCanchas();

    useEffect(() => {
        loadCanchas();
    }, [pagination.page]);

    const handleEdit = (cancha: any) => {
        selectCancha(cancha);
        toggleForm();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta cancha?')) {
            await deleteCancha(id);
        }
    };

    const columns = [
        {
            key: 'nombre',
            label: 'Nombre',
            render: (value: string) => value
        },
        {
            key: 'techada',
            label: 'Techada',
            render: (value: boolean) => value ? 'Sí' : 'No'
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (_: any, row: any) => (
                <DataRowActions
                    onEdit={() => handleEdit(row)}
                    onDelete={() => handleDelete(row.id)}
                />
            )
        }
    ];

    return (
        <div>
            <DataTableActions
                title="Canchas"
                onAdd={() => {
                    selectCancha(null);
                    toggleForm();
                }}
                addButtonText="Agregar Cancha"
            />
            
            <DataTable
                data={canchas}
                columns={columns}
                loading={loading}
            />
            
            <DataPagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                onPageChange={setPage}
            />
        </div>
    );
}