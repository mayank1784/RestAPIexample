//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { isString } = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO

mongoose
  .connect("mongodb://127.0.0.1:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error(err));

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////Request Targeting all articles//////////////////////////////////////////////////////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    console.log(req.body.title);
    console.log(req.body.title);
    newArticle
      .save()
      .then(() => {
        res.send("article saved");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete(function (req, res) {
    Article.deleteMany()
      .then(() => {
        res.send("Successfully deleted all articles");
      })
      .catch((err) => {
        res.send(err);
      });
  });

//////////////////////////////////////Request Targeting specific articles//////////////////////////////////////////////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        res.send(foundArticle);
      })
      .catch((err) => {
        res.send("No articles matching that title not found");
      });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
    //   { overwrite: true }
    )
      .then(() => {
        res.send("Successfully updated article");
      })
      .catch((err) => {
        res.send(err);
      });
  }).patch( function(req,res){
// Article.
  }).delete();

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
