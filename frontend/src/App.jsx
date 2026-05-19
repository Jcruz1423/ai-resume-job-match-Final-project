import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const loadHistory = async () => {
    const response = await fetch("http://localhost:5050/api/history");
    const data = await response.json();
    setHistory(data);
    setHistoryLoaded(true);
  };

  const selectHistoryItem = (item) => {
    setResult({
      matchScore: item.matchScore,
      feedback: item.feedback,
      matchedSkills: item.matchedSkills,
      missingSkills: item.missingSkills,
    });
    setResume(item.resume || "");
    setJobDescription(item.jobDescription || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5050/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resume, jobDescription }),
    });

    const data = await response.json();
    setResult(data);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e5e7eb, #f9fafb)",
      padding: "40px",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "white",
      padding: "40px",
      borderRadius: "20px",
      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
    },
    title: {
      fontSize: "42px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "10px",
    },
    subtitle: {
      textAlign: "center",
      color: "#555",
      marginBottom: "30px",
      fontSize: "18px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "8px",
      fontSize: "18px",
    },
    textarea: {
      width: "100%",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #ccc",
      fontSize: "16px",
      marginBottom: "24px",
      boxSizing: "border-box",
    },
    button: {
      background: "#111827",
      color: "white",
      padding: "14px 24px",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    results: {
      marginTop: "35px",
      background: "#f3f4f6",
      border: "1px solid #ddd",
      padding: "25px",
      borderRadius: "16px",
    },
    skill: {
      display: "inline-block",
      padding: "8px 12px",
      borderRadius: "999px",
      margin: "5px",
      background: "#d1fae5",
      color: "#065f46",
      fontWeight: "bold",
    },
    missingSkill: {
      display: "inline-block",
      padding: "8px 12px",
      borderRadius: "999px",
      margin: "5px",
      background: "#fee2e2",
      color: "#991b1b",
      fontWeight: "bold",
    },
    historySection: {
      marginTop: "35px",
      paddingTop: "30px",
      borderTop: "1px solid #e5e7eb",
    },
    historyButton: {
      background: "#374151",
      color: "white",
      padding: "14px 24px",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginBottom: "20px",
    },
    historyList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    historyItem: {
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "16px 20px",
      marginBottom: "12px",
      cursor: "pointer",
    },
    historyMeta: {
      color: "#6b7280",
      fontSize: "14px",
      marginTop: "6px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>ResumeMatch AI</h1>
        <p style={styles.subtitle}>
          Compare your resume to a job description using AI-style matching.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Resume</label>
          <textarea
            rows="8"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here..."
            style={styles.textarea}
          />

          <label style={styles.label}>Job Description</label>
          <textarea
            rows="8"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            Analyze Resume
          </button>
        </form>

        <div style={styles.historySection}>
          <button type="button" onClick={loadHistory} style={styles.historyButton}>
            Load History
          </button>

          {history.length > 0 && (
            <>
              <h2>Previous Analyses</h2>
              <ul style={styles.historyList}>
                {history.map((item) => (
                  <li
                    key={item._id}
                    style={styles.historyItem}
                    onClick={() => selectHistoryItem(item)}
                  >
                    <strong>Match Score: {item.matchScore}%</strong>
                    <div style={styles.historyMeta}>
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div style={styles.historyMeta}>
                      {item.feedback}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {historyLoaded && history.length === 0 && (
            <p style={{ color: "#6b7280" }}>No saved analyses yet.</p>
          )}
        </div>

        {result && (
          <div style={styles.results}>
            <h2>Analysis Results</h2>
            <p>
              <strong>Match Score:</strong> {result.matchScore}%
            </p>
            <p>
              <strong>Feedback:</strong> {result.feedback}
            </p>

            <h3>Matched Skills</h3>
            <div>
              {result.matchedSkills?.map((skill, index) => (
                <span key={index} style={styles.skill}>
                  {skill}
                </span>
              ))}
            </div>

            <h3>Missing Skills</h3>
            <div>
              {result.missingSkills?.map((skill, index) => (
                <span key={index} style={styles.missingSkill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;