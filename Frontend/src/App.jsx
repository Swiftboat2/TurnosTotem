import './App.css'
import IngresoUsuario from './components/IngresoUsuario'
import TurnosTecnica from './components/Tecnica'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TurnosPago from './components/Pago';
import TurnosConsulta from './components/Consulta';
import TeleTecnica from './components/TeleTecnica';
import TeleConsulta from './components/TeleConsulta';
import TelePago from './components/TelePago';
import ComentariosTecnica from './components/TecnicaComentarios';


function App() {

  return (
<Router>
  <Routes>
    <Route path="/" element={<IngresoUsuario />} />
    <Route path="/tecnica" element={<TurnosTecnica />} />
    <Route path="/pago" element={<TurnosPago />} />
    <Route path="/consulta" element={<TurnosConsulta />} />
    <Route path="/teletecnica" element={<TeleTecnica />} />
    <Route path="/teleconsulta" element={<TeleConsulta />} />
    <Route path="/telepago" element={<TelePago />} />
    <Route path="/resolvertecnica" element={<ComentariosTecnica />} />

  </Routes>
</Router>
  )
}

export default App
