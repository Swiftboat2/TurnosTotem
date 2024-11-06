const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});


const pool = new Pool({
    user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432, 
    database: 'TotemVideoDigital',
  });
  

function setupSocketHandlers(socket) {
    const handleDatabaseQuery = async (query, params) => {
        try {
            const res = await pool.query(query, params);
            return res.rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    };

// Función para obtener los turnos por destino
const getTurnosByDestino = async (destino) => {
    try {
      return await handleDatabaseQuery(
        'SELECT * FROM turnos WHERE DESTINO = $1 AND ESTADO = $2 ORDER BY CREADO_A ASC',
        [destino, 'PENDIENTE']
      );
    } catch (error) {
      throw new Error(`Error fetching turnos for destino ${destino}`);
    }
  };
  
  // Consulta para "Técnica"
  socket.on('getUsuarioTecnica', async () => {
    try {
      const turnos = await getTurnosByDestino('TECNICA');
      socket.emit('respuestaUsuarioTecnica', turnos);
    } catch (error) {
      socket.emit('error', 'Error fetching turnos de tecnica');
    }
  });
  
  // Consulta para "Pagos"
  socket.on('getUsuarioPagos', async () => {
    try {
      const turnos = await getTurnosByDestino('PAGO');
      socket.emit('respuestaUsuarioPagos', turnos);
    } catch (error) {
      socket.emit('error', 'Error fetching turnos de pagos');
    }
  });
  
  // Consulta para "Consulta"
  socket.on('getUsuarioConsulta', async () => {
    try {
      const turnos = await getTurnosByDestino('CONSULTA');
      socket.emit('respuestaUsuarioConsulta', turnos); 
    } catch (error) {
      socket.emit('error', 'Error fetching turnos de consulta');
    }
  });

  // Crear turno  

socket.on('crearTurno', async (body) => {
    const { DNI, DESTINO } = body;
    try {
      const nuevoTurno = await handleDatabaseQuery(
        'INSERT INTO turnos (DNI, DESTINO, ESTADO) VALUES ($1, $2, $3) RETURNING *',
        [DNI, DESTINO, 'PENDIENTE']
      );
      // Emitir los turnos actualizados a todos los clientes
      io.emit('turnosActualizados');  // Esto emite a todos los clientes conectados
      socket.emit('respuestaCrearTurno', nuevoTurno); // Emitir la respuesta al cliente que lo solicitó
    } catch (error) {
      console.error(error);  // Mostrar el error en consola para más detalles
      socket.emit('error', 'Error creando turnos');
    }
  });
  

socket.on('actualizarEstadoDelTurno', async (body) => {
    const { id, ESTADO } = body;
    try {
      const turnoActualizado = await handleDatabaseQuery(
        'UPDATE turnos SET ESTADO = $1 WHERE id = $2 RETURNING *',
        [ESTADO, id]
      );
      // Emitir el evento para que los clientes recarguen la lista de turnos
      io.emit('turnosActualizados'); // Este evento se usará para refrescar la vista
  
      socket.emit('respuestaActualizarEstado', turnoActualizado);
    } catch (error) {
      socket.emit('error', 'Error actualizando el estado del turno');
    }
  });
  
  
}

io.on('connection', (socket) => {
setupSocketHandlers(socket);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});


module.exports = {
    app,
    server,
    io,
    setupSocketHandlers,
}