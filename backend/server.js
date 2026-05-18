const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/analyze", (req, res) => {
  const { resume, jobDescription } = req.body;

  const skills = ["react", "node", "mongodb", "javascript"];

  let score = 0;
  let matchedSkills = [];
  let missingSkills = [];

  skills.forEach((skill) => {
    if (
      resume.toLowerCase().includes(skill) &&
      jobDescription.toLowerCase().includes(skill)
    ) {
      score += 25;
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  let feedback = "Good start. Add more matching technical skills.";

  if (score >= 75) {
    feedback = "Excellent match for this position.";
  } else if (score >= 50) {
    feedback = "Decent match, but you could improve your resume.";
  }

  res.json({
    message: "Analysis complete",
    matchScore: score,
    feedback,
    matchedSkills,
    missingSkills,
  });
});

app.listen(5050, () => {
  console.log("Server running on port 5050");
});
