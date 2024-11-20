import './App.css'
import IngresoUsuario from './components/IngresoUsuario.jsx'
import Admin from './components/Admin.jsx'
import TurnosTecnica1 from './components/tecnica/Tecnica1.jsx'
import TurnosTecnica2 from './components/tecnica/Tecnica2.jsx'
import TurnosTecnica3 from './components/tecnica/Tecnica3.jsx'
import TeleTecnica from './components/tecnica/TeleTecnica.jsx';
import ComentariosTecnica from './components/tecnica/TecnicaComentarios.jsx';
import TurnosPago1 from './components/pago/Pago1.jsx';
import TurnosPago2 from './components/pago/Pago2.jsx';
import TurnosPago3 from './components/pago/Pago3.jsx'
import TelePago from './components/pago/TelePago.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TurnosConsulta1 from './components/consulta/Consulta1.jsx';
import TurnosConsulta2 from './components/consulta/Consulta2.jsx';
import TurnosConsulta3 from './components/consulta/Consulta3.jsx';
import TeleConsulta from './components/consulta/TeleConsulta.jsx';



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
