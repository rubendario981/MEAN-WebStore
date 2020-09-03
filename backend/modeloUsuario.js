'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var bcrypt = require('bcrypt');

const Usuario = mongoose.Schema({
    nombres: String,
    nickName: String,
    correo: String,
    password: String,
    listaCompras: [],
    listaFavoritos: [],
    rol: String
})

Usuario.methods.encriptaPass = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
Usuario.methods.validaPass = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('Usuario', Usuario)