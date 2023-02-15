'use strict'
//cargamos el servidor de express
var express = require('express');
//cargamos el body-parser
var bodyParser = require('body-parser');
//ejecutamos express
var app = express();
//cargamos el archivo de rutas
var product_routes = require('./routes/routes');
//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas
//app.use('/', product_routes);

//si queremos escribir una rota sobre estas lo podemos hacer asi:
app.use('/api', product_routes);

module.exports = app;