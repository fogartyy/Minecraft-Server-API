const express = require('express')
//set
const app = express()
const port = 3000
//reqire fs
const fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('../sslcert/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('../sslcert/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//cors
const cors = require('cors');
app.use(cors());
//function that gets data from dirrectory sucking.world/playerdata
async function getData() {
  //require fs
  const fs = require('fs');
  //get files from directory ../Sucking/world/stats/
  const files = fs.readdirSync('../Sucking/world/stats/');
  //create array
  var data = [];

  //loop through files and read data from each file
  for (const file of files) {
    //get data from file
    var filedata = fs.readFileSync(`../Sucking/world/stats/${file}`, 'utf8');
    //parse data from file
    var parsed = JSON.parse(filedata);
    //get UUID from file name
    var uuid = file.replace('.json', '');
    //get player name from UUID
    var name = await getMinecraftName(uuid);
    //add data to array
    data.push({
      uuid: uuid,
      data: parsed,
      name: name
    });
  }
  //return data
  return data;
}

//function get minecraft name from uui using mojang api async 
async function getMinecraftName(uuid) {
  //require request
  const request = require('request');
  //get data from mojang api
  var data = await request('https://api.mojang.com/user/profile/' + uuid, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    //return data
    return body;
  });
  //return data
  return data;
}





//get data
var data = getData();

//get data
app.get('/data', (req, res) => {
  //get data
    var data = getData();
    //send data
    //format text as json
    res.setHeader('Content-Type', 'application/json');
    //send data
    res.send(JSON.stringify(data));


})

//get data
app.get('/', (req, res) => {
  res.send('Hello World!')
})

httpServer.listen(8080);
httpsServer.listen(8443);