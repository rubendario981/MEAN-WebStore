'use strict'

var express = require('express');
var controlador = require('./controlador');

var router = express.Router();

router.post('/crearProducto', controlador.crearProducto);
router.get('/listarProductos', controlador.listarProductos);
//ruta para buscar articulo por su id
router.get('/buscar/:id', controlador.buscar);
router.put('/actualizaProducto/:id', controlador.actualizarProducto);
router.delete('/eliminarProducto/:id', controlador.eliminarProducto);

//ruta para buscar en la base de datos por palabra
router.get('/busqueda/:var', controlador.busqueda);


module.exports = router;