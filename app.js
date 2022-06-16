const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const { DB_HOST, PORT = 3000 } = process.env;

const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

const usersRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

mongoose.connect(DB_HOST)
  .then(() => { 
    console.log("Database connection successful")
    app.listen(PORT)
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal Server Error" } = err; 
  res.status(status).json({ message })
})

module.exports = app
