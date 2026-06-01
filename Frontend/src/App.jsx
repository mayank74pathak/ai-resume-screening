import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ResumeList from "./pages/ResumeList";

import RankCandidates from "./pages/RankCandidates";
 
function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/upload"  element={<UploadResume />} />
          <Route path="/resumes" element={<ResumeList />} />
           
          <Route path="/ranking" element={<RankCandidates />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
 
export default App;
 