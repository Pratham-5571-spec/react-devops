const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const client = require("prom-client");

// collect default node metrics
client.collectDefaultMetrics();

// HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

/* ===============================
   MIDDLEWARE TO COUNT REQUESTS
=================================*/
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode
    });
  });
  next();
});

/* ===============================
   DATABASE CONNECTION
=================================*/
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ===============================
   MODEL
=================================*/
const Todo = mongoose.model("Todo", {
  title: String,
  completed: Boolean
});

/* ===============================
   ROUTES
=================================*/
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.json(todo);
});

/* ===============================
   PROMETHEUS METRICS ENDPOINT
=================================*/
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

/* ===============================
   SERVER START
=================================*/
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});