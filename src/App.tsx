import { Route, Routes } from 'react-router'
import JugadoresList from './sections/Jugadores/JugadoresList'
import JugadoresSave from './sections/Jugadores/JugadoresSave'
import CanchasList from './sections/Canchas/CanchasList'
import CanchasSave from './sections/Canchas/CanchasSave'

function App() {

  return (
    <Routes>
      <Route path='/' element={<JugadoresList />} />

      <Route path='/jugadores' element={<JugadoresList />} />
      <Route path='/jugadores/create' element={<JugadoresSave />} />
      <Route path='/jugadores/edit/:id' element={<JugadoresSave />} />

      <Route path='/canchas' element={<CanchasList />} />
      <Route path='/canchas/create' element={<CanchasSave />} />
      <Route path='/canchas/edit/:id' element={<CanchasSave />} />


    </Routes>
  )
}

export default App
