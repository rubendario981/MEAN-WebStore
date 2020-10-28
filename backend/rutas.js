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
router.post('/agregaFav/:idUsuario', controlador.agregaFav);
router.post('/borrarFav/:idUsuario', controlador.borrarFav);
router.post('/borrarTodoFav/:idUsuario', controlador.borrarTodoFav);
router.post('/agregarCarrito/:idUsuario', controlador.agregarCarrito);
router.post('/borrarCarrito/:idUsuario', controlador.borrarCarrito);
router.post('/vaciarCarrito/:idUsuario', controlador.vaciarCarrito);
router.get('/validaFav/:id', controlador.validaFav);
router.get('/identificarUsuario/:id', controlador.identificarUsuario);
router.delete('/eliminarUsuario/:id', controlador.eliminarUsuario);
router.get('/listarProductos', controlador.listarProductos);
router.get('/listarCategorias', controlador.listarCategorias);
router.get('/listarCategoriasNuevas', controlador.listarCategoriasNuevas);
router.get('/listarSubCategorias/:cat', controlador.listarSubCategorias);
router.get('/listarTags', controlador.listarTags);
router.get('/mostrarImagen/:imagen?', controlador.mostrarImagen);
router.get('/detalleProducto/:id?', controlador.detalleProducto);

//ruta para buscar articulo por su id
router.get('/buscar/:id', controlador.buscar);
router.put('/actualizaProducto/:id', controlador.actualizarProducto);
router.delete('/eliminarCategoria/:cat', controlador.eliminarCategoria);
router.delete('/eliminarProducto/:id', validarToken, controlador.eliminarProducto);

//ruta para buscar en la base de datos por palabra
router.get('/busqueda/:var', controlador.busqueda);

//ruta para subir una imagen
router.post('/subirImagen/:id?', cargaArchivos, controlador.subirImagen)

module.exports = router;