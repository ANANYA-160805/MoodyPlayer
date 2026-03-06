const express = require("express");
const songRoutes= require("./routes/song.routes")

const app = express();

app.use(express.json());

app.use('/',songRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;