'use strict';
var dns = require('dns')
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');
require('dotenv')

var app = express();

var port = process.env.PORT || 3000;

process.env.MONGO_URI="mongodb+srv://mflec:40644938m@cluster0.mawps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

var connection = mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true})


var db = mongoose.connection;
db.on("error", console.error.bind(console, "Conection error"))
db.once("open", console.log.bind(console, "Connected"))

const ShortsSchema = mongoose.Schema({
  origin: {type: String, required: true},
  new: {type: Number, required: true, unique: true, default: 0}
})

const Shorts = mongoose.model("Shorts", ShortsSchema)

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
app.post("/api/shorturl/new", (req, res) => {
  const url = req.body.url.split("/").slice(2,).join("/")
  dns.lookup(url, (err, adresses, family) => {
    if (err) res.send({error: "Invalid URL"})
    else {
      Shorts.estimatedDocumentCount((err, count) => {
        if (err) res.send({error: "Failed to fetch number of documents from the database"});
        var short = new Shorts({origin: req.body.url, new: count + 1})
        short.save((err, data) => {
          if (err) res.send({error: "Failed to save URL"})
          else res.send({url: data.origin, new: data.new})
        })
      })
    }
  })
})

app.get("/api/shorturl/:index", (req, res) => {
  if (!+req.params.index) res.redirect("/")
  else {
    Shorts.findOne({new: req.params.index}, (err, data) => {
      err ? res.send({error: "invalid URL"})
      : res.redirect(data.origin)
    })
  }
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});