const Router = require('express').Router();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

const urlSchema = new mongoose.Schema({
  url: {type: String, required: true},
  short_url: {type: Number, required: true}  
});

const Url = mongoose.model('url', urlSchema);

function parseUrl(data){
  return {"original_url": data.url,"short_url": data.short_url}
}

Router.get('/api/shorturl/:short_url', function(req, res){
  Url.findOne({short_url: req.params.short_url}, (err, data) => {
    if(data)
      res.redirect(data.url);
    else 
      res.json('not found');
  });
});

Router.post('/api/shorturl/new', function(req, res){
  Url.findOne({url: req.body.url}, (err, data) => {
    
    if(!data)
      Url.countDocuments({}, (err, count) => {
        Url.create({url: req.body.url, short_url: count + 1}, (err, data) => {
          res.json(parseUrl(data));
        })
      })
    else 
      res.json(parseUrl(data));

  })
});

module.exports = Router;