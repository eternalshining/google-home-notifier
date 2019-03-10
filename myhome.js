var express = require('express');
var googlehome = require('./google-home-notifier');
var ngrok = require('ngrok');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
const serverPort = 8091; // default port
const ngrok_token = process.env.NGROK_AUTHTOKEN;
const ifttt_token = process.env.IFTTT_AUTHTOKEN;
const ifttt_event = process.env.IFTTT_EVENT_NAME;

var deviceName = 'グーちゃん';
var ip = '192.168.11.6'; // default IP

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
  
  if (!req.body) return res.sendStatus(400)
  console.log(req.body);
  
  var text = req.body.text;
  
  if (req.query.ip) {
     ip = req.query.ip;
  }

  var language = 'ja'; // default language code
  if (req.query.language) {
    language;
  }

  googlehome.ip(ip, language);
  googlehome.device(deviceName,language);

  if (text){
    try {
      if (text.startsWith('http')){
        var mp3_url = text;
        googlehome.play(mp3_url, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "text=Hello Google Home"');
  }
})

app.get('/google-home-notifier', function (req, res) {

  console.log(req.query);

  var text = req.query.text;

  if (req.query.ip) {
     ip = req.query.ip;
  }

  var language = 'ja'; // default language code
  if (req.query.language) {
    language;
  }

  googlehome.ip(ip, language);
  googlehome.device(deviceName,language);

  if (text) {
    try {
      if (text.startsWith('http')){
        var mp3_url = text;
        googlehome.play(mp3_url, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
          res.send(deviceName + ' will say: ' + text + '\n');
        });
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "text=Hello+Google+Home"');
  }
})

app.listen(serverPort, function () {
  //ngrok.connect(serverPort, function (err, url) {
  ngrok.connect({authtoken: ngrok_token, addr: serverPort}, function (err, ngrok_url) {
    console.log('Endpoints:');
    console.log('    http://' + ip + ':' + serverPort + '/google-home-notifier');
    console.log('    ' + ngrok_url + '/google-home-notifier');
    console.log('GET example:');
    console.log('curl -X GET ' + ngrok_url + '/google-home-notifier?text=Hello+Google+Home');
    console.log('POST example:');
    console.log('curl -X POST -d "text=Hello Google Home" ' + ngrok_url + '/google-home-notifier');
    var options = {
        url: 'https://maker.ifttt.com/trigger/' + ifttt_event + '/with/key/' + ifttt_token,
        method: 'POST',
        form: {"value1":ngrok_url},
        headers: {'Content-Type':'application/x-www-form-urlencoded'}
    }
    request(options, function (error, response, body) {
        console.log(body);
    })
    console.log(options.url);
  });
})
