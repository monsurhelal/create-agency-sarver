var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwow1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileupload());


app.get('/',(req,res) => {

res.send('i am working')

})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const addservice = client.db("agency").collection("addservice");

  app.post('/addservice',(req,res) =>{

    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');
    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };


    addservice.insertOne({name,description,image})
      .then(result => {

        res.send(result.insertedCount);

      })
      console.log('service')
})

app.get('/service' , (req,res) => {
    addservice.find({})
    .toArray((err,documents) => {
  
      res.send(documents)
    })

  
  
})

});


app.listen(process.env.PORT || 5000)