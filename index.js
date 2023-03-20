const express = require('express')
const app = express()
const port = 3000

//function that gets data from dirrectory sucking.world/playerdata
function getData() {
  //require fs
  const fs = require('fs');
  //get files from dirrectory sucking.world/playerdata
  const files = fs.readdirSync('../Sucking/world/playerdata/');
  //create array
  var data = [];
  //loop through files
  for (var i = 0; i < files.length; i++) {
    //get file
    var file = files[i];
    //read file
    var content = fs.readFileSync('../Sucking/world/playerdata/' + file);
    //convert to json
    var json = JSON.parse(content);
    //add to array
    data.push(json);
  }
  //return array
  return data;
}

//get data
var data = getData();

//get data
app.get('/data', (req, res) => {
  //get data
    var data = getData();
    //send data
    res.send(data);
})

//get data
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})