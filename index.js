require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;
let shortUrls = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const urlObject = new URL(req.body.url);
  dns.lookup(urlObject.hostname, (err, address, family) => {
    if(err)
    {
      res.json({ error: 'invalid url' });
    }
    else{
      shortUrls.push(req.body.url);
      res.json({ original_url: req.body.url, short_url: shortUrls.length});
    }
  }); 
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  res.redirect(shortUrls[req.params.shorturl-1]);
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
