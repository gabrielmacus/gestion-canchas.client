import React, { useEffect, useState } from 'react';
import { useCanchas } from './CanchasContext';
import { Cancha } from '../../modules/Canchas/Domain/Cancha';

export default function CanchasList() {
    const { canchas, loading, error, cargarCanchas, eliminarCancha } = useCanchas();
    const [paginaActual, setPaginaActual] = useState(1);
    const [canchaSeleccionada, setCanchaSeleccionada] = useState<Cancha | null>(null);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

    useEffect(() => {
        cargarCanchas({ page: paginaActual, limit: 10 });
    }, [cargarCanchas, paginaActual]);

    const manejarEliminar = async () => {
        if (canchaSeleccionada) {
            try {
                await eliminarCancha(canchaSeleccionada.id);
                setMostrarModalEliminar(false);
                setCanchaSeleccionada(null);
            } catch (error) {
                console.error('Error al eliminar cancha:', error);
            }
        }
    };

    const confirmarEliminar = (cancha: Cancha) => {
        setCanchaSeleccionada(cancha);
        setMostrarModalEliminar(true);
    };

    const cambiarPagina = (nuevaPagina: number) => {
        setPaginaActual(nuevaPagina);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Canchas</h2>
                <button
                    onClick={() => window.location.href = '/canchas/nueva'}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nueva Cancha
                </button>
            </div>

            {/* Tabla de canchas */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dirección
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capacidad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Superficie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio/Hora
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {canchas?.data.map((cancha) => (
                            <tr key={cancha.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {cancha.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cancha.direccion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cancha.capacidad} personas
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cancha.tipoSuperficie}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${cancha.precioHora.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        cancha.disponible 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {cancha.disponible ? 'Disponible' : 'No disponible'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => window.location.href = `/canchas/editar/${cancha.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => confirmarEliminar(cancha)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {canchas && canchas.totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => cambiarPagina(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Anterior
                    </button>
                    
                    {Array.from({ length: canchas.totalPages }, (_, i) => i + 1).map((pagina) => (
                        <button
                            key={pagina}
                            onClick={() => cambiarPagina(pagina)}
                            className={`px-3 py-2 text-sm rounded-md ${
                                pagina === paginaActual
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {pagina}
                        </button>
                    ))}

                    <button
                        onClick={() => cambiarPagina(paginaActual + 1)}
                        disabled={paginaActual === canchas.totalPages}
                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {mostrarModalEliminar && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Confirmar eliminación
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro de que deseas eliminar la cancha "{canchaSeleccionada?.nombre}"?
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3 space-x-4">
                                <button
                                    onClick={() => setMostrarModalEliminar(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={manejarEliminar}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}