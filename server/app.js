const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose")
const Cohort = require("./models/Cohort.model")
const Student = require("./models/Student.model")
mongoose.set('runValidators', true);

const cookieParser = require("cookie-parser");
const PORT = 5005;
const cohorts = require("./cohorts.json")
const students = require("./students.json")
const cors = require("cors")

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173']
}))

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Conected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err))

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//Cohorts

app.post("/api/cohorts", (req, res) => {

  const newCohort = req.body

  Cohort.create(newCohort)
    .then((cohort) => {
      res.status(201).json(cohort)
    })
    .catch((err) => {
      console.log("error creating a new cohort...", err)
      res.status(500).json({ error: "Error creating a new cohort in the DB..." })
    })

})

app.get("/api/cohorts", (req, res) => {
  Cohort
    .find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts", cohorts)
      res.json(cohorts)
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error)
      res.status(500).json({ error: "Failed to retrieve cohorts" })
    })
})

app.get("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params

  Cohort.findById(cohortId)
    .then((cohort) => {
      res.json(cohort)
    })
    .catch((err) => {
      console.log("error getting a new cohort...", err)
      res.status(500).json({ error: "Error getting a new cohort in the DB..." })
    })
})

app.put("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params
  const newDetails = req.body

  Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
    .then((cohort) => {
      res.json(cohort)
    })
    .catch((err) => {
      console.log("error updating a new cohort...", err)
      res.status(500).json({ error: "Error updating a new cohort in the DB..." })
    })
})

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const { cohortId } = req.params

  Cohort.findByIdAndDelete(cohortId)
    .then((cohort) => {
      res.status(204).json(cohort)
    })
    .catch((err) => {
      console.log("error deleting a new cohort...", err)
      res.status(500).json({ error: "Error deleting a new cohort in the DB..." })
    })
})


// Students

app.post("/api/students", (req, res) => {

  const newStudent = req.body

  Student.create(newStudent)
    .then((student) => {
      res.status(201).json(student)
    })
    .catch((err) => {
      console.log("error creating a new student...", err)
      res.status(500).json({ error: "Error creating a new student in the DB..." })
    })

})

app.get("/api/students", (req, res) => {
  Student
    .find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students", students)
      res.json(students)
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error)
      res.status(500).json({ error: "Failed to retrieve students" })
    })
})

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const { cohortId } = req.params

  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((student) => {
      res.json(student)
    })
    .catch((err) => {
      console.log("error getting a student...", err)
      res.status(500).json({ error: "Error getting a student in the DB..." })
    })
})

app.get("/api/students/:studentID", (req, res) => {
  const { studentID } = req.params

  Student.findById(studentID)
    .populate("cohort")
    .then((student) => {
      res.json(student)
    })
    .catch((err) => {
      console.log("error getting a new student...", err)
      res.status(500).json({ error: "Error getting a new student in the DB..." })
    })
})

app.put("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params
  const newDetails = req.body

  Student.findByIdAndUpdate(studentId, newDetails, { new: true })
    .then((student) => {
      res.json(student)
    })
    .catch((err) => {
      console.log("error updating a new student...", err)
      res.status(500).json({ error: "Error updating a new student in the DB..." })
    })
})

app.delete("/api/students/:studentId", (req, res) => {
  const { studentId } = req.params

  Student.findByIdAndDelete(studentId)
    .then((student) => {
      res.status(204).json(student)
    })
    .catch((err) => {
      console.log("error deleting a new student...", err)
      res.status(500).json({ error: "Error deleting a new student in the DB..." })
    })
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});