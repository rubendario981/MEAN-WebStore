'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EsqCategoria = new Schema({    
    categoria: String,
    subCategoria: String
    
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('Categorias', EsqCategoria);