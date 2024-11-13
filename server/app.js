const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const cohorts = require("./cohorts.json")
// const students = require("./students.json")
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");
const cors = require("cors");


const mongoose = require("mongoose");

mongoose
.connect("mongodb://127.0.0.1:27017/mongoose-intro-dev")
.then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
.catch(err => console.error("Error connecting to mongo", err));


const PORT = 5005;


// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
app.use(cors());


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts", (req, res) => {
//   res.json(cohorts);
// });

// app.get("/api/students", (req, res) => {
//   res.json(students);
// });

// STUDENTS ROUTES
// POST /api/students - Creates a new student
app.post('/api/students', (req, res, next) => {

  const newStudent = req.body;

  Student.create(newStudent)
  .then((studentFromDB) => {
      res.status(201).json(studentFromDB);
  })
  .catch(error => {
      console.log(error)
      res.status(500).json({error: "Failed to create a new student"})
  })
});

// GET /api/students - Retrieves all of the students in the database collection
app.get("/api/students", (req, res, next) => {
  Student.find()
  .populate("cohort")
      .then((studentsFromDB) => {
          res.status(200).json(studentsFromDB);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "Failed to get list of students" });
      });
})

// GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res, next) => {

  const {cohortId} = req.params;

  Student.find({cohort: cohortId})
      .populate("cohort")
      .then((studentsFromDB) => {
          res.status(200),json(studentsFromDB);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "Failed to get this students list" });
      });
})

// GET /api/students/:studentId - Retrieves a specific student by id
app.get("/api/students/:studentId", (req, res, next) => {

  const {studentId} = req.params;

  Student.findById(studentId)
      .populate("cohort")
      .then((studentsFromDB) => {
          res.status(200),json(studentsFromDB);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "Failed to get this student details" });
      });
})

// PUT /api/students/:studentId - Updates a specific student by id
app.put("/api/students/:studentId", (req, res, next) => {

  const { studentId } = req.params;
  const newDetails = req.body;

  Student.findByIdAndUpdate(studentId, newDetails, { new: true })
      .then((studentsFromDB) => {
          res.status(200).json(studentsFromDB);
      })
      .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Failed to update the student" });
      });
});

// DELETE /api/students/:studentId - Deletes a specific student by id
app.delete("/api/students/:studentId", (req, res, next) => {

  const { studentId } = req.params;

  Student.findByIdAndDelete(studentId)
      .then(() => {
          res.status(204).send();
      })
      .catch((error) => {
          console.error("Error deleting student...");
          console.error(error);
          res.status(500).json({ error: "Failed to delete student" });
      });
});

// COHORT ROUTES
// POST /api/cohorts - Creates a new cohort
app.post('/api/cohorts', (req, res, next) => {

  const newCohort = req.body;

  Cohort.create(newCohort)
  .then((cohortFromDB) => {
      res.status(201).json(cohortFromDB);
  })
  .catch(error => {
      console.log(error)
      res.status(500).json({error: "Failed to create a new cohort"})
  })
});

// GET /api/cohorts - Retrieves all of the cohorts in the database collection
app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
      .then((cohortsFromDB) => {
          res.status(200).json(cohortsFromDB);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "Failed to get list of cohorts" });
      });
})


// GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res, next) => {

  const {cohortId} = req.params;

  Cohort.findById(cohortId)
      .then((cohortsFromDB) => {
          res.status(200),json(cohortsFromDB);
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "Failed to get this cohort details" });
      });
})

// PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", (req, res, next) => {

  const { cohortId } = req.params;
  const newDetails = req.body;

  Cohort.findByIdAndUpdate(cohortId, newDetails, { new: true })
      .then((cohortsFromDB) => {
          res.status(200).json(cohortsFromDB);
      })
      .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Failed to update the cohort" });
      });
});


// DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", (req, res, next) => {

  const { cohortId } = req.params;

  Cohort.findByIdAndDelete(cohortId)
      .then(() => {
          res.status(204).send();
      })
      .catch((error) => {
          console.error("Error deleting cohort...");
          console.error(error);
          res.status(500).json({ error: "Failed to delete cohort" });
      });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});