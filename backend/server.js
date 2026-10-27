require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Student Records API is running",
  });
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json(students);
  } catch (error) {
    console.error("GET /api/students failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get one student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("GET /api/students/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Create a student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student({
      fullName: req.body.fullName,
      course: req.body.course,
      yearLevel: req.body.yearLevel,
      section: req.body.section,
    });

    const savedStudent = await student.save();
    return res.status(201).json(savedStudent);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid student data", errors: error.errors || undefined });
    }
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({ message: "Malformed JSON request body" });
    }
    console.error("POST /api/students failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update a student
app.put("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        fullName: req.body.fullName,
        course: req.body.course,
        yearLevel: req.body.yearLevel,
        section: req.body.section,
      },
      {
        new: true,
        runValidators: true,
        omitUndefined: true,
      }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid student data", errors: error.errors || undefined });
    }
    console.error("PUT /api/students/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
      deletedStudent: student,
    });
  } catch (error) {
    console.error("DELETE /api/students/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Handle malformed JSON from express.json()
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Malformed JSON request body" });
  }
  return next(error);
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB first, then start the server.
async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing. Add it to your .env file.");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Student Records API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start server:", error.message);
    process.exit(1);
  }
}

startServer();
