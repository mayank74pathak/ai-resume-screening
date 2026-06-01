import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Loader from "../components/Loader";

function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/resumes")
      .then((res) => setResumes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const latest = resumes.length
    ? (resumes[resumes.length - 1].candidate_name || resumes[resumes.length - 1].filename || "—").slice(0, 16)
    : "None";

  return (
    <div className="page-content">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Overview of your AI resume screening system</p>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="metric-grid">
            <div className="metric">
              <div className="metric-val">{resumes.length}</div>
              <div className="metric-lbl">Total resumes</div>
            </div>
            <div className="metric">
              <div className="metric-val" style={{ fontSize: "18px", paddingTop: "6px" }}>
                {latest}
              </div>
              <div className="metric-lbl">Latest upload</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Quick actions</div>
            <div className="quick-actions">
              <button className="btn btn-primary" onClick={() => navigate("/upload")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload resume
              </button>
              <button className="btn btn-ghost" onClick={() => navigate("/ranking")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                  <path d="M4 22h16"/>
                </svg>
                Rank candidates
              </button>
              
            </div>
          </div>

          {resumes.length > 0 && (
            <div className="card">
              <div className="card-title">Recent uploads</div>
              {resumes.slice(-3).reverse().map((r) => (
                <div key={r._id} className="resume-row">
                  <div>
                    <div className="resume-name">{r.candidate_name || r.filename}</div>
                    <div className="resume-meta">{r.filename}</div>
                  </div>
                  <span className="badge">Indexed</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;