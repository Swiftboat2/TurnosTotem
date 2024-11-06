import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const TurnosConsulta = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    // Función para obtener los turnos
    const obtenerTurnos = () => {
      socket.emit('getUsuarioConsulta');
    };
  
    // Obtener los turnos cuando el componente se monte
    obtenerTurnos();
  
    // Escuchar el evento de actualización de turnos
    socket.on('turnosActualizados', () => {
      // Volver a obtener los turnos para refrescar la vista
      obtenerTurnos();
    });
  
    // Escuchar los turnos de la técnica
    socket.on('respuestaUsuarioConsulta', (turnos) => {
      setTurnos(turnos);
    });
  
    // Cleanup de listeners cuando el componente se desmonte
    return () => {
      socket.off('turnosActualizados');
      socket.off('respuestaUsuarioConsulta');
    };
  }, []);
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Turnos de Consulta</h1>
      {turnos.length === 0 ? (
        <p className="text-lg text-gray-600">No hay turnos en espera.</p>
      ) : (
        <ul className="space-y-4">
          {turnos.map((turno) => (
            <li 
              key={turno.id} 
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <span className="font-semibold text-gray-800">{turno.dni}</span>
                <span className="ml-2 text-sm text-gray-600">- {turno.estado}</span>
              </div>
              <button
                onClick={() => {
                  socket.emit('actualizarEstadoDelTurno', {
                    id: turno.id,
                    ESTADO: 'LISTO',
                  });
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Listo
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TurnosConsulta;
