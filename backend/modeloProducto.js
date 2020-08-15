'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EsquemaProducto = mongoose.Schema({
    nombre: String,
    marca: String,
    descripcion: String,
    categoria: String, //{ type: Schema.ObjectId, ref: 'Categorias' },
    subCategoria: String, // { type: Schema.ObjectId, ref: 'SubCategorias' },
    precio: Number,
    fecha: {type: Date, default: Date.now},
    imagen: String
});

module.exports = mongoose.model('Producto', EsquemaProducto);