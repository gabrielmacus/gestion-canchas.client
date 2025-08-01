import React, { useState, useEffect } from 'react';
import { useCanchas } from './CanchasContext';
import { Cancha } from '../../modules/Canchas/Domain/Cancha';
import { DataForm } from '../SharedKernel/DataForm';

export default function CanchaSave() {
    const { selectedCancha, createCancha, updateCancha, toggleForm } = useCanchas();
    const [formData, setFormData] = useState<Cancha>({
        id: '',
        nombre: '',
        techada: false
    });

    useEffect(() => {
        if (selectedCancha) {
            setFormData(selectedCancha);
        } else {
            setFormData({
                id: '',
                nombre: '',
                techada: false
            });
        }
    }, [selectedCancha]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedCancha) {
            await updateCancha(formData);
        } else {
            const newCancha = { ...formData, id: crypto.randomUUID() };
            await createCancha(newCancha);
        }
    };

    const handleChange = (field: keyof Cancha, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const fields = [
        {
            name: 'nombre',
            label: 'Nombre',
            type: 'text' as const,
            value: formData.nombre,
            onChange: (value: string) => handleChange('nombre', value),
            required: true
        },
        {
            name: 'techada',
            label: 'Techada',
            type: 'checkbox' as const,
            value: formData.techada,
            onChange: (value: boolean) => handleChange('techada', value),
            required: false
        }
    ];

    return (
        <DataForm
            title={selectedCancha ? 'Editar Cancha' : 'Nueva Cancha'}
            fields={fields}
            onSubmit={handleSubmit}
            onCancel={toggleForm}
        />
    );
}