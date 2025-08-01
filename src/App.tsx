import { Navigate, Route, Routes } from 'react-router'
import JugadoresList from './sections/Jugadores/JugadoresList'
import JugadoresSave from './sections/Jugadores/JugadoresSave'
import CanchasList from './sections/Canchas/CanchasList'
import CanchasSave from './sections/Canchas/CanchasSave'
import ReservasSave from './sections/Reservas/ReservasSave'
import ReservasList from './sections/Reservas/ReservasList'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

function App() {

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/reservas' />} />

      <Route path='/jugadores' element={<JugadoresList />} />
      <Route path='/jugadores/create' element={<JugadoresSave />} />
      <Route path='/jugadores/edit/:id' element={<JugadoresSave />} />

      <Route path='/canchas' element={<CanchasList />} />
      <Route path='/canchas/create' element={<CanchasSave />} />
      <Route path='/canchas/edit/:id' element={<CanchasSave />} />

      <Route path='/reservas' element={<ReservasList />} />
      <Route path='/reservas/create' element={<ReservasSave />} />
      <Route path='/reservas/edit/:id' element={<ReservasSave />} />


    </Routes>
  )
}

export default App
