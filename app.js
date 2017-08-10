const express = require("express")
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const pgPromise = require("pg-promise")()
const pg = require("pg")

const app = express()
const database = pgPromise({ database: "robots" })
app.use(express.static("public"))

app.engine("mustache", mustacheExpress())
app.set("views", "./templates")
app.set("view engine", "mustache")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*
  CREATE TABLE robots ()=
    "id" serial key
    "name" STRING
    "avatar" STRING
    "email" STRING,
    "university" STRING,
    "job" STRING,
    "company" STRING,
    "skills" ARRAY,
    "phone" INTEGER,
    "address" {
      "street_num" INTEGER,
      "street_name" STRING,
      "city" VARCHAR(255),
      "state_or_province" STRING,
      "postal_code" INTEGER,
      "country" STRING
    }
  )
*/

// app.get("/", (req, res) => {
//   database.any(`SELECT * from robots`).then(robots => {
//     res.render("home", { robots })
//   })
// })
//
app.get("/", (req, res) => {
  database.any("SELECT * FROM robots").then(robots => {
    res.render("home", { users: robots })
  })
})

app.get("/add", (req, res) => {
  res.render("add")
})

app.post("/add", (req, res) => {
  let newRobot = req.body
  database
    .one(
      `INSERT INTO "robots" (username, name, avatar, email, job, company, phone, address, university, skills)
             VALUES($(username), $(name), $(avatar), $(email), $(job), $(company), $(phone), $(address), $(university), $(skills)) RETURNING id`,
      newRobot
    )
    .then(newRobot => {
      res.render("add-confirmation")
    })
})

app.post("/delete/:username", (req, res) => {
  const username = req.params.username
  database
    .one('DELETE FROM "robots" WHERE username = $(username) RETURNING id', {
      username: username
    })
    .then(username => {
      res.render("delete-confirmation")
    })
})

app.get("/profile/:username", (req, res) => {
  // const id = req.params.id - 1
  const username = req.params.username
  database
    .one("SELECT * FROM robots WHERE username = $(username)", {
      username: username
    })
    // Bring back its details!
    .then(robots => {
      // Render a template
      res.render("profile", robots)
    })
    .catch(err => {
      res.render("error")
    })

  // const userDetails = data.users[req.params.id - 1]
  // res.render("profile", userDetails)
})

app.listen(3000, function() {
  console.log("Successfully started User Directory!")
})
