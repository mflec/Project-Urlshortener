require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser= require("body-parser")
const mongoose= require("mongoose")
const { Schema } = mongoose;

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
try {

await Url.create({url: "landon"}, (err, data)=>{
res.json({created: true})
})
res.json({ url: req.body.url });

} catch(e) { 
console.log(e)
}
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});