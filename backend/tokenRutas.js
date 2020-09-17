const JWT = require('jsonwebtoken')
const Usuario = require('./modeloUsuario')

const validarToken = async (req, res, next) =>{
    try {
        const token = req.headers["x-access-token"]

        if(!token) return res.status(400).send({mensaje: 'No hay token para validacion'})

        const validarToken = JWT.verify(token, 'eres un secreto');

        const userFound = await Usuario.findById(validarToken.id)
        if(!userFound) return res.status(404).send({mensaje: 'usuario no encontrado'})        
        if(!userFound.rol) return res.status(404).send({mensaje: 'sin rol definido'})
        if(userFound.rol != 'administrador') return res.status(403).send({mensaje: 'sin permisos para la operacion deseada '})        
        next()

    } catch (error) {
        return res.status(500).send({mensaje: 'Sin autorizacion para la operacion'})

    }
}

module.exports = validarToken;