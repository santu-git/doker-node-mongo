const express = require('express');
const app = express();
const router = express.Router();
const db = require('./db');
const events = require('./routes/events');
const index = require('./routes/index');

const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));

app.use('/',index)
app.use('/events', events);

app.listen(port, function () {
  console.log(`Example app listening on ${port}!`);
})



