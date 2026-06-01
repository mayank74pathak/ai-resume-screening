const MEDALS = ["🥇", "🥈", "🥉"];

function CandidateCard({ candidate, index }) {
  const finalW = Math.min(100, Math.max(0, Number(candidate.final_score) || 0));

  return (
    <div
      className={`rank-card fade-up fade-up-${Math.min(index + 1, 4)}${
        index === 0 ? " rank-top" : ""
      }`}
    >
      <div className="rank-position">#{index + 1}</div>

      {/* Name */}
      <div className="rank-name">
        {MEDALS[index] ?? "👤"} {candidate.candidate}
      </div>

      {/* Three scores */}
      <div className="rank-scores">
        <div className="rank-score-item">
          <span className="rank-score-val val-final">
            {candidate.final_score}
          </span>
          Final ATS Score
        </div>
        <div className="rank-score-item">
          <span className="rank-score-val val-match">
            {candidate.match_score}
          </span>
          AI Match Score
        </div>
        <div className="rank-score-item">
          <span className="rank-score-val val-sim">
            {candidate.similarity_score}%
          </span>
          Vector Similarity
        </div>
      </div>

      {/* Bar driven by final_score */}
      <div className="score-bar-wrap">
        <div className="score-bar" style={{ width: `${finalW}%` }} />
      </div>

      {/* Gemini reason */}
      <div className="rank-reason">{candidate.reason}</div>
    </div>
  );
}

export default CandidateCard;