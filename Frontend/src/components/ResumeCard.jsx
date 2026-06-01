function ResumeCard({ resume, onDelete }) {
  const uploadDate = resume.uploaded_at
    ? new Date(resume.uploaded_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="resume-row">
      <div>
        <div className="resume-name">
          {resume.candidate_name || resume.filename}
        </div>
        <div className="resume-meta">
          {resume.filename} &middot; {uploadDate}
        </div>
      </div>

      <div className="resume-actions">
        <span className="badge">Indexed</span>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(resume._id)}
          title="Delete resume"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ResumeCard;