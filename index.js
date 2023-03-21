const express = require('express')
//set Access-Control-Allow-Origin
const cors = require('cors');


const app = express()
const port = 3000

//function that gets data from dirrectory sucking.world/playerdata
function getData() {
  //require fs
  const fs = require('fs');
  //get files from dirrectory sucking.world/playerdata
  const files = fs.readdirSync('../Sucking/world/stats/');
  //create array
  var data = [];
  //loop through files save data to array with each entry being labeled with the file name as UUID
  files.forEach(file => {
    //get data from file
    var filedata = fs.readFileSync('../Sucking/world/stats/' + file, 'utf8');
    //parse data from file
    var parsed = JSON.parse(filedata);
    //get uuid from file name
    var uuid = file.replace('.json', '');
    //add data to array
    var array =[];
    getApiData(uuid);

    getMinecraftImage(uuid);

    array.push({
      uuid: uuid,
      data: parsed,
      name: getApiData(uuid),
        image: getMinecraftImage(uuid)
    });

    data.push(array);
    
  });
  //return data
  return data;

  
}

//function that gets data from api based on uuid fetch from internbet
function getApiData(uuid) {
    //require fetch
    const fetch = require('node-fetch');
    //get data from api
    fetch('https://api.mojang.com/user/profiles/' + uuid)
    .then(res => res.json())
    .then(json => console.log(json));
}

//get mincraft image from api
function getMinecraftImage(uuid) {
    //require fetch
    const fetch = require('node-fetch');
    //get data from api
    fetch('https://crafatar.com/avatars/' + uuid)
    .then(res => res.json())
    .then(json => console.log(json));
}






//get data
var data = getData();

//set Access-Control-Allow-Origin
app.use(cors());


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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})