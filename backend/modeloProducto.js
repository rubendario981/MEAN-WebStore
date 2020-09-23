'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EsquemaProducto = new Schema({
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