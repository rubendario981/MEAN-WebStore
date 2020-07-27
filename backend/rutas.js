'use strict'

var express = require('express');
var controlador = require('./controlador');

var router = express.Router();

router.post('/crearProducto', controlador.crearProducto);
router.get('/listarProductos', controlador.listarProductos);
router.put('/actualizaProducto/:id', controlador.actualizarProducto);
router.get('/buscar/:id', controlador.buscar);

module.exports = router;