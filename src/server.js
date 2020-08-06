require = require('esm')(module);

const express = require('express');
const config = require('./config.js');
const app = express();
const bodyParser = require('body-parser');

//controllers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect to model
require('./models/db');

const userRouter = require('./routes/user');

app.get('/test', (req,res) => {
    res.status(200);
    res.send("hello");
});

app.use('/user', userRouter);

app.listen(config.PORT, ()=>console.log(`server started on port: ${config.PORT}`));

//for tests
module.exports = app;