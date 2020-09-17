'use strict'

var express = require('express');
var controlador = require('./controlador');
var multyParty = require('connect-multiparty');
var cargaArchivos = multyParty({uploadDir: './imgProductos'});
var validarToken = require('./tokenRutas')

var router = express.Router();

router.post('/registroUsuario', controlador.registroUsuario);
router.post('/inicioSesion', controlador.inicioSesion);
router.post('/crearCategoria', validarToken, controlador.crearCategoria);
router.post('/crearSubCategoria', validarToken, controlador.crearSubCategoria);
router.post('/crearProducto', validarToken, cargaArchivos, controlador.crearProducto);
router.get('/listarProductos', controlador.listarProductos);
router.get('/listarCategorias', controlador.listarCategorias);
router.get('/listarSubCategorias', controlador.listarSubCategorias);
router.get('/mostrarImagen/:imagen', controlador.mostrarImagen);
router.get('/detalleProducto/:id?', controlador.detalleProducto);

//ruta para buscar articulo por su id
router.get('/buscar/:id', controlador.buscar);
router.put('/actualizaProducto/:id', controlador.actualizarProducto);
router.delete('/eliminarProducto/:id', validarToken, controlador.eliminarProducto);

//ruta para buscar en la base de datos por palabra
router.get('/busqueda/:var', controlador.busqueda);

//ruta para subir una imagen
router.post('/subirImagen/:id?', validarToken, cargaArchivos, controlador.subirImagen)

module.exports = router;