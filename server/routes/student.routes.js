const router = require("express").Router()

const Student = require("../models/Student.model")



router.post("/api/students", (req, res) => {

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

router.get("/api/students", (req, res) => {
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

router.get("/api/students/cohort/:cohortId", (req, res) => {
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

router.get("/api/students/:studentID", (req, res) => {
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

router.put("/api/students/:studentId", (req, res) => {
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

router.delete("/api/students/:studentId", (req, res) => {
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

module.exports = router