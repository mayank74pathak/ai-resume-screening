import { useState } from "react";
import API from "../services/api";
import CandidateCard from "../components/CandidateCard";
import Loader from "../components/Loader";

function RankCandidates() {
  const [jd,         setJd]         = useState("");
  const [topK,       setTopK]       = useState(5);
  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState(null);

  const rank = async () => {
    const desc = jd.trim();
    if (!desc) return;
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      const res = await API.post("/rank-candidates", {
        job_description: desc,
        top_k: Number(topK),
      });
      setCandidates(res.data);
      setDone(true);
    } catch {
      setError("Ranking failed — is the backend running?");
    }
    setLoading(false);
  };

  return (
    <main className="page">
      <div className="page-header fade-up fade-up-1">
        <h1 className="page-title">Rank candidates</h1>
        <p className="page-sub">
          AI-powered ranking with Gemini · sorted by Final ATS Score
        </p>
      </div>

      {/* Input card */}
      <div className="card fade-up fade-up-2">

        {/* Job description */}
        <div className="field">
          <label>Job description</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="e.g. Looking for a FastAPI developer with 2+ years experience, strong MongoDB and AWS skills, familiar with RAG and LLM pipelines…"
          />
        </div>

        {/* Top K input */}
        <div className="field">
          <label>Number of candidates to rank (Top K)</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="number"
              min="1"
              max="100"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              style={{ width: "100px" }}
            />
            <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
              Min 1 · Max 100
            </span>
          </div>
        </div>

        {/* Gemini notice */}
        {loading && (
          <div className="alert alert-info" style={{ marginBottom: "14px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8"  x2="12"   y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Ranking {topK} candidate{topK > 1 ? "s" : ""} with Gemini — this may take a few seconds…
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8"  x2="12"   y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={rank}
          disabled={loading || !jd.trim()}
        >
          {loading ? (
            <>
              <span className="btn-spinner" />
              Ranking…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              </svg>
              Rank candidates
            </>
          )}
        </button>
      </div>

      {/* Score formula note */}
      {done && !loading && candidates.length > 0 && (
        <div className="alert alert-info fade-up" style={{ marginBottom: "16px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8"  x2="12"   y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            <strong>Final ATS Score</strong> = AI Match Score × 0.7 + Vector Similarity × 0.3
            &nbsp;· Showing top {candidates.length} result{candidates.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Loader */}
      {loading && <Loader />}

      {/* Empty state */}
      {done && !loading && candidates.length === 0 && (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <p className="empty-title">No candidates found</p>
          <p className="empty-sub">Upload some resumes first</p>
        </div>
      )}

      {/* Results */}
      {!loading &&
        candidates.map((candidate, index) => (
          <CandidateCard
            key={index}
            candidate={candidate}
            index={index}
          />
        ))}
    </main>
  );
}

export default RankCandidates;