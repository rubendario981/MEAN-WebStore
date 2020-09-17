'use strict'

var express = require('express');
var bodyparse = require('body-parser');
var morgan = require('morgan');
var session = require('express-session')
var cors = require('cors');

//ejecutar servidor express
var server = express();

//carga modulo de rutas
var rutas = require('./rutas');

//middlewares: se pone en uso el convertidor de datos bodyParser
server.use(morgan('dev'));
server.use(bodyparse.urlencoded({extended: false}));
server.use(bodyparse.json());
server.use(session({secret: 'gatitoloco', resave: false, saveUninitialized: false}))

//CORS  PETICIONES DESDE EL FRONTEND
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
server.use(cors({ origin: true, credentials: true  }));

//Poner en funcionamiento modulo de rutas
//Se puede poner un prefijo a las rutas ('/xxx', modulo-rutas)
server.use('/', rutas);

//exportar modulo
module.exports = server;