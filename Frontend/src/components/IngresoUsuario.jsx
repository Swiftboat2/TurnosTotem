import { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Asegúrate de que la URL sea la correcta

export default function IngresoUsuario() {
  const [selectedOption, setSelectedOption] = useState('');
  const [dni, setDni] = useState('');
  const [options] = useState(['TECNICA', 'PAGO', 'CONSULTA']);
  const [message, setMessage] = useState('');

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleDniChange = (event) => {
    setDni(event.target.value);
  };

  const handleSubmit = () => {
    if (dni && selectedOption) {
      // Emitir el evento 'crearTurno' al servidor con el DNI y DESTINO
      socket.emit('crearTurno', { DNI: dni, DESTINO: selectedOption });

      // Escuchar la respuesta del servidor
      socket.on('respuestaCrearTurno', (nuevoTurno) => {
        setMessage(`Turno creado: ${nuevoTurno[0].id}, Destino: ${nuevoTurno[0].destino}`);
      });

      // Manejar errores
      socket.on('error', (errorMessage) => {
        setMessage(`Error: ${errorMessage}`);
      });
    } else {
      setMessage('Por favor, ingrese el DNI y seleccione un destino.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Registro de Turno
        </h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="dni" className="sr-only">DNI</label>
            <input
              id="dni"
              type="number"
              value={dni}
              onChange={handleDniChange}
              placeholder="Ingrese su DNI"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {options.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                  ${selectedOption === option
                    ? 'bg-blue-800 text-white'
                    : 'bg-white text-blue-800 border border-blue-800'}
                  hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enviar
            </button>
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-gray-700 bg-gray-100 p-3 rounded-md">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
