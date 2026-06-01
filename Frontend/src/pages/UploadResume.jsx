import { useState, useRef } from "react";
import API from "../services/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const selectFile = (f) => {
    if (!f || f.type !== "application/pdf") {
      setMessage({ type: "error", text: "Please select a valid PDF file." });
      return;
    }
    setFile(f);
    setMessage(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    selectFile(e.dataTransfer.files[0]);
  };

  const uploadResume = async () => {
    if (!file) return;
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/upload-resume", formData);
      setMessage({
        type: "success",
        text: `Uploaded successfully — ${res.data.chunks} chunks created. ID: ${res.data.document_id}`,
      });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setMessage({ type: "error", text: "Upload failed — is the backend running at http://127.0.0.1:8000?" });
    }
    setLoading(false);
  };

  return (
    <div className="page-content">
      <h1 className="page-title">Upload resume</h1>
      <p className="page-sub">Upload a PDF to extract, chunk, and embed it into the system</p>

      <div className="card">
        <div className="card-title">Select PDF</div>

        <div
          className={`upload-zone${drag ? " drag" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ margin: "0 auto 10px", display: "block" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <p><strong>Click to browse</strong> or drag &amp; drop</p>
          <p style={{ fontSize: "12px", marginTop: "4px" }}>PDF files only</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => selectFile(e.target.files[0])}
        />

        {file && (
          <div className="alert alert-info" style={{ marginTop: "14px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            {file.name} &nbsp;({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        {message && (
          <div className={`alert alert-${message.type === "success" ? "success" : "error"}`} style={{ marginTop: "12px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {message.type === "success"
                ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              }
            </svg>
            {message.text}
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <button
            className="btn btn-primary"
            onClick={uploadResume}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ borderTopColor: "#fff", width: "14px", height: "14px" }} />
                Uploading...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadResume;