import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AI Resume Job Match App</h1>
      <p>Compare your resume to a job description and get feedback.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <h3>Resume</h3>
          <textarea
            rows="8"
            cols="60"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here"
          />
        </div>

        <div>
          <h3>Job Description</h3>
          <textarea
            rows="8"
            cols="60"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here"
          />
        </div>

        <button type="submit">Analyze</button>
      </form>

      {result && (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc" }}>
          <h2>Analysis Results</h2>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Match Score:</strong> {result.matchScore}%</p>
          <p><strong>Feedback:</strong> {result.feedback}</p>
          <h3>Missing Skills</h3>
          <ul>
            {result.missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
