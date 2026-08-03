import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css'
import VulnPrioritizer from './pages/VulnPrioritizer';
import VulnDetail from './pages/VulnDetail';
import IncidentList from './pages/IncidentList';
import IncidentDetail from './pages/IncidentDetail';
import IncidentDashboard from './pages/IncidentDashboard';
import PhishingScorer from './pages/PhishingScorer';
import AttributionEngine from './pages/AttributionEngine';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';

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
            <Route path="/killchain" element={<IncidentList/>}></Route>
            <Route path="/killchain/:id" element={<IncidentDetail/>}></Route>
            <Route path="/killchain-overview" element={<IncidentDashboard/>}></Route>
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