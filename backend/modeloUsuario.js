'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var bcrypt = require('bcrypt');

const Usuario = new Schema({
    nombres: String,
    nickName: String,
    correo: String,
    password: String,
    listaCompras: [],
    listaFavoritos: [],
    rol: String
}, {versionKey: false, timestamps: true})

Usuario.methods.encriptaPass = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
Usuario.methods.validaPass = function(password){
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('Usuario', Usuario)