import { useEffect, useState } from "react";
import API from "../services/api";
import ResumeCard from "../components/ResumeCard";
import Loader from "../components/Loader";

function ResumeList() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = () => {
    setLoading(true);
    setError(null);
    API.get("/resumes")
      .then((res) => setResumes(res.data))
      .catch(() => setError("Could not load resumes — is the backend running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResumes(); }, []);

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await API.delete(`/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Resume list</h1>
      <p className="page-sub">All uploaded candidates in the system</p>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div className="card-title" style={{ margin: 0 }}>
            All resumes {!loading && <span style={{ color: "var(--hint)", fontWeight: 400 }}>({resumes.length})</span>}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchResumes}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>

        {loading && <Loader />}

        {error && (
          <div className="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && resumes.length === 0 && (
          <div className="empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>No resumes uploaded yet</p>
          </div>
        )}

        {!loading && resumes.map((resume) => (
          <ResumeCard
            key={resume._id}
            resume={resume}
            onDelete={deleteResume}
          />
        ))}
      </div>
    </div>
  );
}

export default ResumeList;