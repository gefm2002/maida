import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Geno32Landing from './pages/Geno32Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/geno32" element={<Geno32Landing />} />
        <Route path="/tratamiento-geno32" element={<Geno32Landing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
