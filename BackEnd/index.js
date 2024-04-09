require('dotenv').config();
const express = require("express");
const path = require("path");
const routes = require("./routes/routes");
const connectToDb = require("./database/db");
const cors = require('cors');

connectToDb();
const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(routes);
app.use(cors("http://localhost:5173"));

app.listen(port, () =>
  console.log('Servidor rodando em http://localhost:${port}')
);