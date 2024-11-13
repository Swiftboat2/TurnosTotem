import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
const socket = io('ws://localhost:3000/')


function Admin() {

    const [turnos, setTurnos] = useState([]);
// Formatea la hora para obtener solo la hora (sin minutos ni segundos)
const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.getHours(); // Extrae solo la hora
  };
  
  // Función para filtrar los turnos del día actual
  const filterTurnosByDay = (turnos) => {
    const today = new Date(); // Fecha actual
    const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Inicio del día (00:00:00)
    const todayEnd = new Date(today.setHours(23, 59, 59, 999)); // Fin del día (23:59:59)
  
    return turnos.filter(turno => {
      const turnoDate = new Date(turno.creado_a); // Convierte el string de la fecha a un objeto Date
      return turnoDate >= todayStart && turnoDate <= todayEnd; // Filtra solo los turnos del día actual
    });
  };
  
  // Función para contar los turnos por hora y tipo
  const countTurnosByHourAndType = (turnos) => {
    const hoursRange = [8, 10, 12, 14, 16, 18]; // Franjas horarias: 8, 10, 12, 14, 16, 18
    
    // Inicializa un objeto para almacenar los conteos de turnos por hora y tipo
    const result = hoursRange.map(hour => ({
      hour, 
      tecnica: 0, 
      consulta: 0, 
      pago: 0
    }));
  
    // Recorre los turnos y cuenta los turnos por hora y tipo
    turnos.forEach(turno => {
        // Extrae la hora del turno
        const hour = formatTime(turno.creado_a); 
        // Tipo de turno (TECNICA, CONSULTA, PAGO)
        const turnoType = turno.destino.toUpperCase(); 
  
      // Encuentra la franja horaria más cercana a la hora del turno
      let closestHour = hoursRange[0];
      for (let i = 1; i < hoursRange.length; i++) {
        if (hour >= hoursRange[i - 1] && hour < hoursRange[i]) {
          closestHour = hoursRange[i - 1];
          break;
        }
        // Si el turno es exactamente la última hora, asigna a esa franja
        if (hour >= hoursRange[hoursRange.length - 1]) {
          closestHour = hoursRange[hoursRange.length - 1];
        }
      }
  
      // Encuentra la franja horaria correspondiente en el array result
      const hourRange = result.find(r => r.hour === closestHour);
  
      // Incrementa el contador del tipo de turno en la franja correspondiente
      if (hourRange) {
        if (turnoType === 'TECNICA') hourRange.tecnica++;
        if (turnoType === 'CONSULTA') hourRange.consulta++;
        if (turnoType === 'PAGO') hourRange.pago++;
      }
    });
    return result;
};

// Filtrar los turnos del día
const turnosDelDia = countTurnosByHourAndType(filterTurnosByDay(turnos));


useEffect(() => {
    const obtenerTodosLosTurnos = () =>{
        socket.emit('mostrarTodosLosTurnos')
    }

    obtenerTodosLosTurnos()
    
    // Escuchar el evento de actualización de turnos
    socket.on('turnosActualizados', () => {
        // Volver a obtener los turnos para refrescar la vista
        obtenerTodosLosTurnos();
    });
    console.log(obtenerTodosLosTurnos())

    socket.on('mostrarTodosLosTurnos', (turnos) =>{
        setTurnos(turnos)
    })

    return () => {
        socket.off('turnosActualizados');
        socket.off('mostrarTodosLosTurnos');
      };
    }, []);

    console.log(turnos)
return (
<>
<header>
    <div className='w-screen flex text-center items-center justify-center h-20'>
    <h1 className='font-bold text-3xl'>Panel Admin</h1>

    </div>
</header>
<div className='grid grid-cols-2 md:grid-cols-1 sm:grid-cols-1  text-center items-center justify-start mt-20'>
    <div className='text-start'>
        <h1 className='ml-[410px] text-xl font-bold'>Turnos del Dia</h1>
<LineChart width={900} height={500} data={turnosDelDia}>
    <Line type="monotone" dataKey="tecnica" stroke="#8884d8" name="Técnica" />
    <Line type="monotone" dataKey="consulta" stroke="#82ca9d" name="Consulta" />
    <Line type="monotone" dataKey="pago" stroke="#ff7300" name="Pago" />
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="hour" />
    <YAxis />
    <Tooltip />
    <Legend />
  </LineChart>
    </div>
    <div>

    </div>
</div>
</>
);    
}

export default Admin; 