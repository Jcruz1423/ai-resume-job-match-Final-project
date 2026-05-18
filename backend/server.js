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

  res.json({
    message: "Analysis complete",
    matchScore: 85,
    feedback:
      "Your resume is a good match. Add more specific project experience and technical keywords.",
    missingSkills: ["React", "Node.js", "MongoDB"],
  });
});

app.listen(5050, () => {
  console.log("Server running on port 5050");
});
