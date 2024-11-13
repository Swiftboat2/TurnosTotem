import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('ws://localhost:3000/');


const ComentariosTecnica = () =>{
    const [turnos, setTurnos] = useState([]); 
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
               ' ' +
               date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };
    
  useEffect(() => {
    // Función para obtener los turnos
    const obtenerTurnos = () => {
      socket.emit('getUsuarioTecnicaComentado');
    };
  
    // Obtener los turnos cuando el componente se monte
    obtenerTurnos();
  
    // Escuchar el evento de actualización de turnos
    socket.on('turnosActualizados', () => {
      // Volver a obtener los turnos para refrescar la vista
      obtenerTurnos();
    });

    // Escuchar los turnos de la técnica
    socket.on('respuestaResponderTurnoTecnica', (turnos) => {
      setTurnos(turnos);
    });
  
    // Cleanup de listeners cuando el componente se desmonte
    return () => {
      socket.off('turnosActualizados');
      socket.off('respuestaResponderTurnoTecnica');
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Atender de Técnica</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {turnos.map((turno) => (
          <div key={turno.id} className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-gray-800">{turno.dni}</span>
                </div>
                <span className="text-sm text-gray-500">ID: {turno.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  turno.estado === 'LISTO' ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
                }`}>
                  {turno.estado}
                </span>
              </div>
              {turno.comentario && (
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">{turno.comentario}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Atendido: {formatTime(turno.creado_a)}</span>
              </div>
              <button
                onClick={() => {
                  socket.emit('actualizarEstadoDelTurno', {
                    id: turno.id,
                    ESTADO: 'RESUELTO',
                  });
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2"
              >
                <span>Marcar como Atendido</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default ComentariosTecnica