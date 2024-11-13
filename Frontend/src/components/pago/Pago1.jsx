import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:3000/');

const TurnosPago1 = () => {
  const [turnos, setTurnos] = useState([]);
  const [comentarios, setComentarios] = useState({}); 
  
  const handleComentarioChange = (e, id) => {
    setComentarios({
      ...comentarios,
      [id]: e.target.value, 
    });
  }
  
  const handleSubmit = (e, id) => {
    e.preventDefault();
    const comentario = comentarios[id]; 
    socket.emit('comentarTurno', { id, comentario });
  }
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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Turnos de Pago</h1>
      {turnos.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center h-32">
          <p className="text-lg text-gray-600">No hay turnos en espera.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {turnos.map((turno) => (
            <div key={turno.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-gray-800">{turno.dni}</span>
                  <span className="font-semibold text-gray-800">ID:  {turno.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                     turno.estado === 'ATENDIENDO' ? 'bg-yellow-100 text-yellow-800' 
                     : turno.estado === 'LLAMANDO DE BOX 1' ? 'bg-red-100 text-red-800'
                     : 'bg-gray-100 text-gray-800'
                  }`}>
                    {turno.estado}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => {
                      socket.emit('actualizarEstadoDelTurno', {
                        id: turno.id,
                        ESTADO: 'LLAMANDO DE BOX 1',
                      });
                    }}
                    className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center gap-2"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a6 6 0 016 6v3.586l.707.707a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414L4 11.586V8a6 6 0 016-6zm0 16a2 2 0 01-1.732-1h3.464A2 2 0 0110 18z" clipRule="evenodd" />
                  </svg>
                  Llamar De Box 1
                  </button>
                  <button
                    onClick={() => {
                      socket.emit('actualizarEstadoDelTurno', {
                        id: turno.id,
                        ESTADO: 'ATENDIENDO',
                      });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Atendiendo
                  </button>
                  <button
                    onClick={() => {
                      socket.emit('actualizarEstadoDelTurno', {
                        id: turno.id,
                        ESTADO: 'LISTO',
                      });
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Listo
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  value={comentarios[turno.id] || ''}
                  onChange={(e) => handleComentarioChange(e, turno.id)}
                  placeholder="Escribe tu comentario"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={(e) => handleSubmit(e, turno.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Comentar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default TurnosPago1;
