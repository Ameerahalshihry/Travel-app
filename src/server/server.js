const dotenv = require('dotenv');
dotenv.config();
const projectData = [];
const express = require('express');
const app =  express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const cors = require('cors')
app.use(cors());

app.use(express.static('dist'));

const server = app.listen(8081, ()=> {
    console.log('Travel app listening on port 8081');
})
//console.log(`Your API key is ${process.env.API_KEY}`);

//GET route
app.get('/', (req, res) =>{
    res.sendFile('./dist/index.html');
})
app.get('/all', (req,res)=>{
    res.send(projectData);
})

//POST route
app.post('/add', (req,res) =>{
    newEntry = {
        city: req.body.city,
        country: req.body.country,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    }
    console.log(`req post is : ${JSON.stringify(newEntry)}`);
    projectData.push(newEntry)
})

module.exports = server;
