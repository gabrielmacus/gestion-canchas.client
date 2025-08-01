import React, { useState, useEffect } from 'react';
import { useCanchas } from './CanchasContext';
import { Cancha } from '../../modules/Canchas/Domain/Cancha';

interface CanchasSaveProps {
    canchaId?: string;
    onGuardar?: () => void;
    onCancelar?: () => void;
}

export default function CanchasSave({ canchaId, onGuardar, onCancelar }: CanchasSaveProps) {
    const { crearCancha, editarCancha, loading } = useCanchas();
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        capacidad: 0,
        tipoSuperficie: '',
        precioHora: 0,
        disponible: true,
    });
    const [errores, setErrores] = useState<{ [key: string]: string }>({});
    const [guardando, setGuardando] = useState(false);

    const esEdicion = Boolean(canchaId);

    // Si es edición, cargar los datos de la cancha
    useEffect(() => {
        if (esEdicion && canchaId) {
            // Aquí deberías cargar los datos de la cancha desde el contexto o API
            // Por ahora lo dejo como placeholder
            console.log('Cargar datos para edición:', canchaId);
        }
    }, [esEdicion, canchaId]);

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : 
                    type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                    value
        }));

        // Limpiar error del campo si existe
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validarFormulario = () => {
        const nuevosErrores: { [key: string]: string } = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es requerido';
        }

        if (!formData.direccion.trim()) {
            nuevosErrores.direccion = 'La dirección es requerida';
        }

        if (formData.capacidad <= 0) {
            nuevosErrores.capacidad = 'La capacidad debe ser mayor a 0';
        }

        if (!formData.tipoSuperficie.trim()) {
            nuevosErrores.tipoSuperficie = 'El tipo de superficie es requerido';
        }

        if (formData.precioHora <= 0) {
            nuevosErrores.precioHora = 'El precio por hora debe ser mayor a 0';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const manejarSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        try {
            setGuardando(true);

            if (esEdicion && canchaId) {
                await editarCancha(canchaId, formData);
            } else {
                await crearCancha(formData);
            }

            // Limpiar formulario después de crear
            if (!esEdicion) {
                setFormData({
                    nombre: '',
                    direccion: '',
                    capacidad: 0,
                    tipoSuperficie: '',
                    precioHora: 0,
                    disponible: true,
                });
            }

            if (onGuardar) {
                onGuardar();
            }
        } catch (error) {
            console.error('Error al guardar cancha:', error);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                    {esEdicion ? 'Editar Cancha' : 'Nueva Cancha'}
                </h2>
            </div>

            <form onSubmit={manejarSubmit} className="p-6 space-y-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={manejarCambio}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errores.nombre ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ingrese el nombre de la cancha"
                    />
                    {errores.nombre && (
                        <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
                    )}
                </div>

                {/* Dirección */}
                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={manejarCambio}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errores.direccion ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ingrese la dirección"
                    />
                    {errores.direccion && (
                        <p className="mt-1 text-sm text-red-600">{errores.direccion}</p>
                    )}
                </div>

                {/* Capacidad y Precio en una fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-2">
                            Capacidad *
                        </label>
                        <input
                            type="number"
                            id="capacidad"
                            name="capacidad"
                            value={formData.capacidad}
                            onChange={manejarCambio}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errores.capacidad ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Número de personas"
                        />
                        {errores.capacidad && (
                            <p className="mt-1 text-sm text-red-600">{errores.capacidad}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="precioHora" className="block text-sm font-medium text-gray-700 mb-2">
                            Precio por Hora *
                        </label>
                        <input
                            type="number"
                            id="precioHora"
                            name="precioHora"
                            value={formData.precioHora}
                            onChange={manejarCambio}
                            min="0"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errores.precioHora ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                        {errores.precioHora && (
                            <p className="mt-1 text-sm text-red-600">{errores.precioHora}</p>
                        )}
                    </div>
                </div>

                {/* Tipo de Superficie */}
                <div>
                    <label htmlFor="tipoSuperficie" className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Superficie *
                    </label>
                    <select
                        id="tipoSuperficie"
                        name="tipoSuperficie"
                        value={formData.tipoSuperficie}
                        onChange={manejarCambio}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errores.tipoSuperficie ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Seleccione el tipo de superficie</option>
                        <option value="Césped natural">Césped natural</option>
                        <option value="Césped sintético">Césped sintético</option>
                        <option value="Concreto">Concreto</option>
                        <option value="Parquet">Parquet</option>
                        <option value="Arcilla">Arcilla</option>
                        <option value="Tartán">Tartán</option>
                    </select>
                    {errores.tipoSuperficie && (
                        <p className="mt-1 text-sm text-red-600">{errores.tipoSuperficie}</p>
                    )}
                </div>

                {/* Disponibilidad */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="disponible"
                        name="disponible"
                        checked={formData.disponible}
                        onChange={manejarCambio}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="disponible" className="ml-2 block text-sm text-gray-700">
                        Cancha disponible para reservas
                    </label>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={guardando || loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear Cancha'}
                    </button>
                </div>
            </form>
        </div>
    );
}