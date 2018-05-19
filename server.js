const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Constants
const UPLOAD_DIR = './uploads/';

// Helpers
const formidable = require("formidable");

// Cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.post("/file-upload", (req, res) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = UPLOAD_DIR;
  form.parse(req);
  form.on("fileBegin", (name, file) => {
    file.path = UPLOAD_DIR + file.name;
  });
  form.on("file", (name, file) => {
    console.log("Uploaded " + file.name);
  });
  form.on("end", () => {
    console.log('All files uploaded!');
    res.status(200).send({ status: 'uploaded'});
  });
  form.on("error", (err) => {
    console.log('Error:', err);
    res.status(500).send({ status: 'error' });
  });
});

// Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Run
const port = 3001;
app.listen(port, () => console.log(`Running server on port ${port}!`));
