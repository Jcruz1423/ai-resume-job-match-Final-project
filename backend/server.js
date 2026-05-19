require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const analysisSchema = new mongoose.Schema({
  resume: String,
  jobDescription: String,
  matchScore: Number,
  feedback: String,
  matchedSkills: [String],
  missingSkills: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.model("Analysis", analysisSchema);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/analyze", async (req, res) => {
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

  const newAnalysis = await Analysis.create({
    resume,
    jobDescription,
    matchScore: score,
    feedback,
    matchedSkills,
    missingSkills,
  });

  res.json({
    message: "Analysis complete",
    matchScore: score,
    feedback,
    matchedSkills,
    missingSkills,
    savedAnalysisId: newAnalysis._id,
  });
});

app.get("/api/history", async (req, res) => {
  const analyses = await Analysis.find().sort({ createdAt: -1 });
  res.json(analyses);
});

app.listen(5050, () => {
  console.log("Server running on port 5050");
});
