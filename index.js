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
    array.push({
      uuid: uuid,
      data: parsed
    });

    data.push(array);
    
  });
  //return data
  return data;

  
}

//function that gets data from api based on uuid

//get data
var data = getData();

//set Access-Control-Allow-Origin
app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};


//get data
app.get('/data',cors(corsOptions), async (req, res) => {
  //get data
  const fs = require('fs');
  //get files from dirrectory sucking.world/playerdata
  const files = fs.readdirSync('../Sucking/world/stats/');
  //create array
  
  var data = [];
  //loop through files save data to array with each entry being labeled with the file name as UUID
  files.forEach(file => async () => {
    //get data from file
    var filedata = fs.readFileSync('../Sucking/world/stats/' + file, 'utf8');
    //parse data from file
    var parsed = JSON.parse(filedata);
    //get uuid from file name
    var uuid = file.replace('.json', '');


    const fetchOptions = {
        method: 'GET'
    }
    const response = await fetch(`https://api.mojang.com/user/profile/${uuid}`, fetchOptions);
    const jsonResponse = await response.json();


    //add data to array
    var array =[];
    array.push({
      uuid: uuid,
      data: parsed,
        name: jsonResponse.name
    });

    data.push(array);
    
  });
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