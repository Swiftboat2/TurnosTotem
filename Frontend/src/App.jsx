import './App.css'
import IngresoUsuario from './components/IngresoUsuario'
import Admin from './components/Admin'
import TurnosTecnica1 from './components/tecnica/Tecnica1'
import TurnosTecnica2 from './components/tecnica/Tecnica2'
import TurnosTecnica3 from './components/tecnica/Tecnica3'
import TeleTecnica from './components/tecnica/TeleTecnica';
import ComentariosTecnica from './components/tecnica/TecnicaComentarios';
import TurnosPago1 from './components/pago/Pago1';
import TurnosPago2 from './components/pago/Pago2';
import TurnosPago3 from './components/pago/pago3'
import TelePago from './components/pago/TelePago';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TurnosConsulta1 from './components/consulta/Consulta1';
import TurnosConsulta2 from './components/consulta/Consulta2';
import TurnosConsulta3 from './components/consulta/Consulta3';
import TeleConsulta from './components/consulta/TeleConsulta';



function App() {

  return (
<Router>
  <Routes>
    <Route path="/" element={<IngresoUsuario />} />
    <Route path='/admin' element={<Admin />}/>
    <Route path="/tecnica1" element={<TurnosTecnica1 />} />
    <Route path="/tecnica2" element={<TurnosTecnica2 />} />
    <Route path="/tecnica3" element={<TurnosTecnica3 />} /> 
    <Route path="/resolvertecnica" element={<ComentariosTecnica />} />
    <Route path="/teletecnica" element={<TeleTecnica />} />
    <Route path="/pago1" element={<TurnosPago1 />} />
    <Route path="/pago2" element={<TurnosPago2 />} />
    <Route path="/pago3" element={<TurnosPago3 />} />
    <Route path="/telepago" element={<TelePago />} />
    <Route path="/consulta1" element={<TurnosConsulta1 />} />
    <Route path="/consulta2" element={<TurnosConsulta2 />} />
    <Route path="/consulta3" element={<TurnosConsulta3 />} />
    <Route path="/teleconsulta" element={<TeleConsulta />} />
  </Routes>
</Router>
  )
}

export default App
