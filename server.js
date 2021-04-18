//models
const TodoTask = require("./models/TodoTask");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const port = 3000;
const mongoose = require("mongoose");

dotenv.config();

// Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
app.use(express.urlencoded({ extended: true }));
// for access public folder below cmd
app.use("/static", express.static("public"));
// to set e ejs as template engine
app.set("view engine", "ejs");

// get method for main page
// GET METHOD
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("index.ejs", { todoTasks: tasks });
  });
});

// post method for server
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});
//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//connection to db
// mongoose.set("useUnifiedTopology: true")
// mongoose.set("useFindAndModify", false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running on ${port}"));
});