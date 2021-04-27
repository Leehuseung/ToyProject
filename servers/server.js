const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const config = require('../config.json');

const router = express.Router();

app.use(cors({
    //app origin
    origin: ['http://localhost:3000'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


const db = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});



app.all('/test', (req,res) => {
   res.json({'result' : 'success'});
});

app.listen(config.server.port,  () => {
    console.log('running on port 8080');
});

//localhost:8080/insert?param=text
app.get('/insert',(req,res) => {
    const query = 'insert into test (test) values ("'+req.query.insert+'")';

    db.query(query,(err,result) => {
       res.json({'result' : 'success insert'});
    });
});

app.get('/select',(req,res) => {
    const query = 'select test from test';

    db.query(query,(err,result) => {
        res.send(result);
    });
});


//localhost:8080/insert?param=text&updateParam=textUpdate
app.get('/update',(req,res) => {
    const query =`update test set test = '${req.query.updateParam}' where test = '${req.query.param}'`;

    db.query(query,(err,result) => {
        res.json({'result' : 'success update'});
    });
});

app.get('/delete',(req,res) => {
    const query =`DELETE FROM TEST WHERE TEST = '${req.query.param}'`;

    db.query(query,(err,result) => {
        res.json({'result' : 'success delete'});
    });
});





module.exports = {db};