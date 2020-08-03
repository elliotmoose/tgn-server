const express = require('express');
const config = require('./config.js');
const app = express();
const bodyParser = require('body-parser');

//controllers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to model
require('./models/db');
const userController = require('./controllers/userController');


app.get('/test', (req,res) => {
    res.status(200);
    res.send("hello");
});

app.use('/user', userController);

app.listen(config.PORT, ()=>console.log(`server started on port: ${config.PORT}`));