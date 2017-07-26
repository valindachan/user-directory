const express = require("express")
const path = require("path")
const mustacheExpress = require("mustache-express")
const data = require("./data")

const app = express()
app.use(express.static("public"))

app.engine("mustache", mustacheExpress())
app.set("views", "./views")
app.set("view engine", "mustache")

app.get("/", (req, res) => {
  res.render("home", data)
})

app.get("/profile/:id", (req, res) => {
  const userDetails = data.users[req.params.id - 1]
  res.render("profile", userDetails)
})

app.listen(3000, function() {
  console.log("Successfully started User Directory")
})
