const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
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
        `SELECT * FROM turnos WHERE DESTINO = $1 AND (ESTADO = $2 OR ESTADO = $3 OR ESTADO = $4 OR ESTADO = $5 OR ESTADO = $6) ORDER BY CREADO_A ASC`,
        [destino, 'PENDIENTE', 'ATENDIENDO', 'LLAMANDO DE BOX 1', 'LLAMANDO DE BOX 2', 'LLAMANDO DE BOX 3']
      );
    } catch (error) {
      throw new Error(`Error fetching turnos for destino ${destino}`);
    }
  };
// Emitir el evento para que los clientes recarguen la lista de turnos
io.emit('turnosActualizados'); // Este evento se usará para refrescar la vista
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

  socket.on('actualizarEstadoDelTurnoListo', async (body) => {
    const { id, ESTADO } = body;
    try {
      const turnoActualizado = await handleDatabaseQuery(
        'UPDATE turnos SET ESTADO = $1, creado_a = NOW() WHERE id = $2 RETURNING *',
        ['LISTO', id]
      );
      io.emit('turnosActualizados');
      socket.emit('respuestaActualizarEstadoListo', turnoActualizado);
    } catch (error) {
      socket.emit('error', 'Error actualizando el estado del turno');
    }
  });
  
  socket.on('comentarTurno', async (body) => {
    const { id, comentario } = body;
    try {
      const turnoActualizado = await handleDatabaseQuery(
        'UPDATE turnos SET comentario = $1 WHERE id = $2 RETURNING *',
        [comentario, id]
      );
      // Emitir el evento para que los clientes recarguen la lista de turnos
      io.emit('turnosActualizados'); // Este evento se usará para refrescar la vista
  
      socket.emit('respuestaComentarTurno', turnoActualizado);
    } catch (error) {
      socket.emit('error', 'Error comentando el turno');
    }
  });

  const getTurnosByDestinoComentarios = async (destino) => {
    try {
      return await handleDatabaseQuery(
        'SELECT * FROM turnos WHERE DESTINO = $1 AND ESTADO = $2 AND comentario IS NOT NULL ORDER BY CREADO_A ASC',
        [destino, 'LISTO']
      );
    } catch (error) {
      throw new Error(`Error fetching turnos for destino ${destino}`);
    }
  };
  // Emitir el evento para que los clientes recarguen la lista de turnos
 // Este evento se usará para refrescar la vista
  // Consulta para "Técnica comentados"
  socket.on('getUsuarioTecnicaComentado', async () => {
    try {
      const turnos = await getTurnosByDestinoComentarios('TECNICA');
      socket.emit('respuestaResponderTurnoTecnica', turnos);
    } catch (error) {
      socket.emit('error', 'Error fetching turnos de tecnica');
    }
  });
  
  // Consulta para "Pagos comentados"
  socket.on('getUsuarioPagosComentado', async () => {
    try {
      const turnos = await getTurnosByDestinoComentarios('PAGO');
      socket.emit('respuestaResponderTurnoPago', turnos);
    } catch (error) {
      socket.emit('error', 'Error fetching turnos de pagos');
    }
  });
  
  // Consulta para "Consulta comentados"
  socket.on('getUsuarioConsultaComentado', async () => {
    try {
      const turnos = await getTurnosByDestinoComentarios('CONSULTA');
      socket.emit('respuestaResponderTurnoConsulta', turnos); 
    } catch (error) {
      socket.emit('error', 'Error fetching turnos de consulta');
    }
  });

  socket.on('mostrarTodosLosTurnos', async () => {
    io.emit('turnosActualizados');
    try {
      const turnos = await handleDatabaseQuery('SELECT * FROM turnos');
        socket.emit('mostrarTodosLosTurnos', turnos)
      } catch (error) {
        throw new Error(`Error fetching turnos`);
      }
  })
    
  
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