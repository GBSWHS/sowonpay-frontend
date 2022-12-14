import 'normalize.css'
import './App.scss'

import { useCookie } from 'react-use'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../LoginPage/LoginPage'
import HomePage from '../HomePage/HomePage'
import QRScanPage from '../QRScanPage/QRScanPage'
import UserPage from '../UserPage/UserPage'
import BoothListPage from '../BoothListPage/BoothListPage'
import BoothPage from '../BoothPage/BoothPage'
import MonitorPage from '../MonitorPage/MonitorPage'

const App = (): JSX.Element => {
  const [isLogined] = useCookie('SESSION_TOKEN')
  if (isLogined === null) {
    return <LoginPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/qrscan" element={<QRScanPage />} />
        <Route path="/users/:id" element={<UserPage />}/>
        <Route path="/booths" element={<BoothListPage />}/>
        <Route path="/booths/:id" element={<BoothPage />}/>
        <Route path="/monitor" element={<MonitorPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
