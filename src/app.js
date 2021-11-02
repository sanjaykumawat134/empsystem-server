const express = require("express");
const empRoutes = require("./routers/employee");
const cors = require("cors");
const userRoutes = require("./routers/users");
require("./db/mongoose");
const app = express();
app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
app.use(express.json());
app.use("/emp", empRoutes);
app.use("/users", userRoutes);
module.exports = app;
