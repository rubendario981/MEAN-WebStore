'use strict'

var mongoose = require('mongoose');

var EsqCategoria = mongoose.Schema({
    
    categoria: String,
    subCategoria: String
    
});

module.exports = mongoose.model('Categorias', EsqCategoria);