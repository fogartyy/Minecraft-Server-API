const express = require('express')
//set
const app = express()
const port = 3000


//cors
const cors = require('cors');
app.use(cors());
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})