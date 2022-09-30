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
import { useEffect } from 'react'

const App = (): JSX.Element => {
  const [isLogined] = useCookie('SESSION_TOKEN')
  if (isLogined === null) {
    return <LoginPage />
  }

  useEffect(() => {
    setInterval(() => {
      fetch('/').catch(() => {
        alert('인터넷 연결이 불안정합니다. WIFI및 데이터 네트워크 상태를 확인해 주세요.')
        window.close()
      })
    }, 10 * 1000)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/qrscan" element={<QRScanPage />} />
        <Route path="/users/:id" element={<UserPage />}/>
        <Route path="/booths" element={<BoothListPage />}/>
        <Route path="/booths/:id" element={<BoothPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
