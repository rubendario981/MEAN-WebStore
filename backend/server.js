'use strict'
//cargar modulos de node para el servidor 
//y convertidor de datos bodyParser
var express = require('express');
var bodyparse = require('body-parser');
var morgan = require('morgan');

//ejecutar servidor express
var server = express();

//carga modulo de rutas
var rutas = require('./rutas');

//middlewares: se pone en uso el convertidor de datos bodyParser
server.use(morgan('dev'));
server.use(bodyparse.urlencoded({extended: false}));
server.use(bodyparse.json());

//CORS  PETICIONES DESDE EL FRONTEND

//Poner en funcionamiento modulo de rutas
//Se puede poner un prefijo a las rutas ('/xxx', modulo-rutas)
server.use('/', rutas);

//exportar modulo
module.exports = server;