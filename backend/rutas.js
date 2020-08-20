'use strict'

var express = require('express');
var controlador = require('./controlador');
var multyParty = require('connect-multiparty');
var cargaArchivos = multyParty({uploadDir: './imgProductos'})

var router = express.Router();

router.post('/crearCategoria', controlador.crearCategoria);
router.post('/crearSubCategoria', controlador.crearSubCategoria);
router.post('/crearProducto', cargaArchivos, controlador.crearProducto);
router.get('/listarProductos', controlador.listarProductos);
router.get('/listarCategorias', controlador.listarCategorias);
router.get('/listarSubCategorias', controlador.listarSubCategorias);
router.get('/mostrarImagen/:imagen', controlador.mostrarImagen);

//ruta para buscar articulo por su id
router.get('/buscar/:id', controlador.buscar);
router.put('/actualizaProducto/:id', controlador.actualizarProducto);
router.delete('/eliminarProducto/:id', controlador.eliminarProducto);

//ruta para buscar en la base de datos por palabra
router.get('/busqueda/:var', controlador.busqueda);

//ruta para subir una imagen
router.post('/subirImagen/:id?', cargaArchivos, controlador.subirImagen)

module.exports = router;