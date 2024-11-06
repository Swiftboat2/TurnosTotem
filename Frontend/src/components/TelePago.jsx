import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const TelePago = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    // Función para obtener los turnos
    const obtenerTurnos = () => {
      socket.emit('getUsuarioPagos');
    };
  
    // Obtener los turnos cuando el componente se monte
    obtenerTurnos();
  
    // Escuchar el evento de actualización de turnos
    socket.on('turnosActualizados', () => {
      // Volver a obtener los turnos para refrescar la vista
      obtenerTurnos();
    });
  
    // Escuchar los turnos de la técnica
    socket.on('respuestaUsuarioPagos', (turnos) => {
      setTurnos(turnos);
    });
  
    // Cleanup de listeners cuando el componente se desmonte
    return () => {
      socket.off('turnosActualizados');
      socket.off('respuestaUsuarioPagos');
    };
  }, []);
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Turnos de Pago</h1>
      {turnos.length === 0 ? (
        <p className="text-lg text-gray-600">No hay turnos en espera.</p>
      ) : (
        <ul className="space-y-4">
          {turnos.map((turno) => (
            <li 
              key={turno.id} 
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-800">DNI: {String(turno.dni).slice(-4)}</span>
                <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">{turno.estado}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default TelePago;
