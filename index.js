const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
var http = require('http');
var https = require('https');
const axios = require('axios');
const cors = require('cors');
var fs = require('fs'),
    nbt = require('prismarine-nbt');
require('dotenv').config({path: `${__dirname}/.env`});

//log
console.log('Starting server...');
console.log('Loading environment variables...');
//log dirname
console.log(__dirname);



const privateKeyLocation = `${process.env.PRIVATE_KEY_LOCATION}`;
console.log(privateKeyLocation);

const certificateLocation = `${process.env.CERTIFICATE_LOCATION}`;
console.log(certificateLocation);

const serverWorldFileLocation = `${process.env.SERVER_WORLD_FILE_LOCATION}`;
console.log(serverWorldFileLocation);

const serverImageLocation = `${process.env.SERVER_IMAGE_LOCATION}`;
console.log(serverImageLocation);

var privateKey  = fs.readFileSync(privateKeyLocation, 'utf8');
var certificate = fs.readFileSync(certificateLocation, 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(cors());
//function that gets data from dirrectory sucking.world/playerdata
async function getData() {
  //require fs
  const fs = require('fs');
  //get files from directory ../Sucking/world/stats/
  const files = fs.readdirSync(serverWorldFileLocation + '/stats/');
  //create array
  var data = [];

  //loop through files and read data from each file
  for (const file of files) {
    //get data from file
    var filedata = fs.readFileSync(serverWorldFileLocation+ `/stats/${file}`, 'utf8');
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

async function getMinecraftName(uuid) {
  try {
    const response = await axios.get(`https://api.mojang.com/user/profile/${uuid}`);
    const body = response.data;
    return body.name;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//get data
app.get('/data', (req, res) => {
  //get data
    getData().then((data) => {
      //send data
      res.send(data);
    });
})

//get image
app.get('/image', (req, res) => {
  //get image
  var image = fs.readFileSync(serverImageLocation);
  //send image
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(image, 'binary');
})

//get data by uuid
app.get('/data/:uuid', (req, res) => {
  //get uuid
  var uuid = req.params.uuid;
  //get data
  getData().then((data) => {
    //loop through data
    for (var i = 0; i < data.length; i++) {
      //check if uuid is equal to uuid in data
      if (data[i].uuid == uuid) {
        //send data
        res.send(data[i]);
      }
    }
  });
})

//get player data nbt function
async function getPlayerData(uuid) {
  //get data from file
  var filedata = fs.readFileSync(serverWorldFileLocation+ `/playerdata/${uuid}.dat`, 'utf8');
  //parse data from file
  var parsed = nbt.simplify(nbt.parse(filedata));
  //return data
  return parsed;
}

//get player data by uuid
app.get('/data/:uuid/player', (req, res) => {
  //get uuid
  var uuid = req.params.uuid;
  //get data



httpServer.listen(8080);
httpsServer.listen(8443);