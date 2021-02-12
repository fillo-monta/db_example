const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./data.db3")
const express = require("express")
const app = new express()
const port = 8080

app.use(express.json())


const userExists = (user, pwd) => {
  db.get("SELECT * FROM user WHERE username = ? AND password = ?", user, pwd, (err, row) => {
    if (err) {
      return console.error(err.message)
    }
    if (row) {
      console.log(`User found with username ${user}`)
      return true
    } else {
      console.log(`No user found with username ${user}`)
      return false
    }
  })
}


db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS user (username TEXT, password TEXT)")

  for (let i = 0; i < 10; i++) {
    if (userExists(`pippo${i + 1}`, `pippo${i + 1}`)) {
      break
    } else {
      db.run("INSERT INTO user (username, password) VALUES (?,?)", `pippo${i + 1}`, `pippo${i + 1}`)
    }
  }
})

app.post("/login", (req, res) => {
  const { user, pwd } = req.body
  db.get("SELECT * FROM user WHERE username = ? AND password = ?", user, pwd, (err, row) => {
    if (row) {
      res.status(200).json({ ok: true })
    } else {
      res.status(401).json({ ok: false })
    }
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})