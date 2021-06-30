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

useUnified

const schema= new Schema({url:"string"})
const Url= mongoose.model('Url', schema)

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl/new', function(req, res) {
const bodyurl= req.body.url

const somet = dns.lookup(urlparser.parse(bodyurl).hostname, 
(error, adress)=> {
if(!adress) {
res.json({error: "Invalid URL"})
} else {
const url= new Url({url: bodyurl})
url.save((err, data)=> {
res.json({
original_url: data.url,
short_url: data.id
})
})

}
})

});

app.get('/api/shorturl/:id', async function(req, res) {
const id= req.params.id
Url.findById(id, (err, data)=> {
if(!data ) {
res.json({error: "Invalid URL"})
} else { 
res.redirect(data.url)
}
})

});


app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});