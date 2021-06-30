require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const { Schema } = mongoose;
const dns = require("dns");
const urlparser= require("url");

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const schema= new Schema({url:"string"})
const Url= mongoose.model('Url', schema)

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/apo/shorturl/new', async function(req, res) {
const bodyurl= req.body.url

const somet = dns.lookup(urlparser.parse(bodyurl).hostname, 
(error, adress)=> {
if(!)
})

const url= new Url({url: bodyurl})


await url.save((err, data)=>{
res.json({created: true})
})

});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});