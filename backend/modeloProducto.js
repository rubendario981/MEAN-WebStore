'use strict'

var mongoose = require('mongoose');
//var esquema = mongoose.Schema;

var EsquemaProducto = mongoose.Schema({
    nombre: String,
    marca: String,
    descripcion: String,
    categoria: String,
    subCategoria: String,
    precio: Number,
    fecha: {type: Date, default: Date.now},
    imagen: String
});

module.exports = mongoose.model('Producto', EsquemaProducto);