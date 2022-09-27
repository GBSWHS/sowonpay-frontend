import 'normalize.css'
import './App.scss'

import { useCookie } from 'react-use'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../LoginPage/LoginPage'
import HomePage from '../HomePage/HomePage'

const App = (): JSX.Element => {
  const [isLogined] = useCookie('SESSION_TOKEN')
  if (isLogined === null) {
    return <LoginPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
