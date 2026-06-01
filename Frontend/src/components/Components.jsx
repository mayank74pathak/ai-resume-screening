import { NavLink } from "react-router-dom";

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  rank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  ),
};

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-dot" />
        ResumeAI
      </div>

      <div className="sidebar-label">Menu</div>

      <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
        {icons.dashboard} Dashboard
      </NavLink>
      <NavLink to="/upload" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
        {icons.upload} Upload Resume
      </NavLink>
      <NavLink to="/resumes" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
        {icons.list} Resume List
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
        {icons.search} Search
      </NavLink>
      <NavLink to="/ranking" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
        {icons.rank} Rank Candidates
      </NavLink>

      <div className="sidebar-footer">
        <p>AI Resume Screening<br />v1.0.0</p>
      </div>
    </aside>
  );
}

export default Navbar;