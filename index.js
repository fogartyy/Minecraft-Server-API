const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
var http = require('http');
var https = require('https');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const privateKeyLocation = `${process.env.PRIVATE_KEY_LOCATION}`;
const certificateLocation = `${process.env.CERTIFICATE_LOCATION}`;

const serverWorldFileLocation = `${process.env.SERVER_WORLD_FILE_LOCATION}`;

const serverImageLocation = `${process.env.SERVER_IMAGE_LOCATION}`;

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

httpServer.listen(8080);
httpsServer.listen(8443);