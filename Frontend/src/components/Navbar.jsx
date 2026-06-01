import { NavLink } from "react-router-dom";

/* ── SVG icons ── */
const Icon = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),

  rank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    </svg>
  ),
  logo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
    </svg>
  ),
};

const links = [
  { to: "/",        label: "Dashboard",       icon: Icon.dashboard, end: true },
  { to: "/upload",  label: "Upload Resume",   icon: Icon.upload },
  { to: "/resumes", label: "Resume List",     icon: Icon.list },
  { to: "/search",  label: "Search",          icon: Icon.search },
  { to: "/ranking", label: "Rank Candidates", icon: Icon.rank },
];

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-mark">{Icon.logo}</div>
          ResumeAI
        </div>
      </div>

      <span className="sidebar-label">Navigation</span>

      {links.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            "nav-link" + (isActive ? " active" : "")
          }
        >
          {icon}
          {label}
        </NavLink>
      ))}

      <div className="sidebar-footer">
        <p>
          AI Resume Screening
          <br />
          v1.0.0 · FastAPI + Gemini
        </p>
      </div>
    </aside>
  );
}

export default Navbar;