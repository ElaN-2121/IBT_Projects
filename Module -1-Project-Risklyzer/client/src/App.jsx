import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css'
import VulnPrioritizer from './pages/VulnPrioritizer';
import KillChainMapper from './pages/KillChainMapper';
import PhishingScorer from './pages/PhishingScorer';
import AttributionEngine from './pages/AttributionEngine';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import VulnDetail from './pages/VulnDetail';

function App() {
  

  return (
    <BrowserRouter>
      <div className='app-shell'>
        <Sidebar/>
          <div className='main-content'>
            <Routes>
                <Route path="/" element={<VulnPrioritizer/>}></Route>
                <Route path="/vulns" element={<VulnPrioritizer/>}></Route>
                <Route path="/vulns/:id" element={<VulnDetail/>}></Route>
                <Route path="/killchain" element={<KillChainMapper/>}></Route>
                <Route path="/phishing" element={<PhishingScorer/>}></Route>
                <Route path="/attribution" element={<AttributionEngine/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
            </Routes>
          </div>
      </div> 
    </BrowserRouter>
  )
}

export default App
