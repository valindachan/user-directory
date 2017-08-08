const express = require("express")
const mustacheExpress = require("mustache-express")
// const data = require("./data")
const pgPromise = require("pg-promise")()
const pg = require("pg")

const app = express()
const database = pgPromise({ database: "robots" })
app.use(express.static("public"))

app.engine("mustache", mustacheExpress())
app.set("views", "./templates")
app.set("view engine", "mustache")

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

app.get("/profile/:id", (req, res) => {
  // const id = req.params.id - 1
  const id = req.params.id
  database
    .one("SELECT * FROM robots WHERE id = $(id)", {
      id: id
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
