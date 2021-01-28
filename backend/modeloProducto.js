'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EsquemaProducto = Schema({
    nombre: String,
    marca: String,
    descripcion: String,
    categoria: String,
    subCategoria: String,
    precio: Number,
    precioPromo: Number,
    tiempoPromo: Date,
    fecha: {type: Date, default: Date.now},
    imagen: String
}, {versionKey: false, timestamps: true});

module.exports = mongoose.model('Producto', EsquemaProducto);