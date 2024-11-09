import './App.css'
import IngresoUsuario from './components/IngresoUsuario'
import TurnosTecnica1 from './components/Tecnica1'
import TurnosTecnica2 from './components/Tecnica2'
import TurnosTecnica3 from './components/Tecnica3'
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
    <Route path="/tecnica1" element={<TurnosTecnica1 />} />
    <Route path="/tecnica2" element={<TurnosTecnica2 />} />
    <Route path="/tecnica3" element={<TurnosTecnica3 />} /> 
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
