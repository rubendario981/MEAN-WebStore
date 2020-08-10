'use strict'

var mongoose = require('mongoose');

var EsquemaNav = mongoose.Schema({
    nomCat: String,
    nomSubCat: [],
    listado:[]
    
});

module.exports = mongoose.model('Navegacion', EsquemaNav);