'use strict'

var Producto = require('./modeloProducto');
var Categorias = require('./modeloCategoria');
var Usuario = require('./modeloUsuario');
var bcrypt = require('bcrypt');
var JWT = require('jsonwebtoken')
var fs = require('fs');
const { resolve } = require('path');
var cat = new Categorias();
var prod, token, usu;

var controlador = {
    /***************************** 331 lineas en total */
    registroUsuario: async (req, res, next) => {
        var params = req.body;
        usu = new Usuario();
        usu.nombres = params.nombres;
        usu.nickName = params.nickName;
        usu.correo = params.correo;
        usu.password = usu.encriptaPass(params.clave)
        usu.rol = params.rol;

        if (!params.rol) usu.rol = 'cliente'

        const emailFound = await Usuario.findOne({ correo: params.correo })
        if (emailFound) return res.status(400).send({ mensaje: 'Ya esta registrado ' + emailFound.correo })
        if (!emailFound) {
            const nickFound = await Usuario.findOne({ nickName: params.nickName })
            if (nickFound) res.status(400).send({ mensaje: 'Ya existe el nickName ' + nickFound.nickName + ' escoje otro' })
            if (!nickFound) {
                const userCreated = usu.save()
                if (!userCreated) return res.status(404).send({ mensaje: 'no se pudo crear usuario' })
                token = JWT.sign({ id: userCreated._id }, 'eres un secreto', { expiresIn: 86400 })
                res.send({ mensaje: 'ok', token })
            }
        }
    },
    /***************************** */
    inicioSesion: async (req, res, next) => {
        const { correo, clave } = req.body;

        const userFound = await Usuario.findOne({ correo: correo })
        if (!userFound) return res.status(404).send({ mensaje: 'usuario no existe ' })

        const passIsValid = await bcrypt.compareSync(clave, userFound.password)
        if (!passIsValid) res.status(401).send({ mensaje: 'Contraseña invalida ' })

        const token = JWT.sign({ id: userFound._id }, 'eres un secreto', { expiresIn: 86400 })
        res.send({ mensaje: 'ok', token })

    },
    /***************************** */
    crearCategoria: async (req, res) => {
        cat.categoria = req.body.categoria;

        const findCat = await Categorias.findOne({ categoria: req.body.categoria })
        if (findCat) return res.status(402).send({ mensaje: 'ya existe la categoria ' })
        const newCategory = await cat.save()
        if (!newCategory) return res.status(404).send({ mensaje: 'No se pudo crear la nueva categoria' })
        return res.send({ mensaje: 'ok', newCategory })
    },

    /***************************** */
    crearSubCategoria: async (req, res) => {
        var { categoria, subCategoria } = req.body;
        cat.categoria = categoria;
        cat.subCategoria = subCategoria;

        const findSubCat = Categorias.findOne({ subCategoria })
        if (findSubCat) return res.status(402).send({ mensaje: 'ya existe la subcategoria' })
        const newSubCat = await cat.save()
        if (!newSubCat) return res.status(404).send({ mensaje: 'No se pudo crear la nueva subCategoria' })
        return res.send({ mensaje: 'ok', newSubCat })
    },

    /***************************** */
    crearProducto: async (req, res) => {
        var params = req.body;
        prod = new Producto();

        prod.nombre = params.nombre;
        prod.marca = params.marca;
        prod.descripcion = params.descripcion;
        prod.categoria = params.categoria;
        prod.subCategoria = params.subCategoria;
        prod.precio = params.precio;
        prod.imagen = params.imagen;

        const productCreated = await prod.save()
        if (!productCreated) res.status(404).send({ mensaje: 'No se pudo crear el producto' })
        res.send({ mensaje: 'ok', productCreated })

    },

    /* **************************** */
    listarProductos: async (req, res) => {

        const listaProductos = await Producto.find({}).sort({ fecha: -1 })
        if (!listaProductos) return res.status(404).send({ mensaje: 'De momento no se pueden listar productos' })
        res.send({ mensaje: 'ok', listaProductos })

    },

    /* **************************** */
    detalleProducto: (req, res) => {
        var params = req.body
        prod.id = params.id

        Producto.findById({})

        return res.status(200).send({ mensaje: prod })
    },

    /************************************** */
    listarCategorias: async (req, res) => {        
        const filtrarCat = []
        const objCat = {}
        const listaCat = await Producto.find({}, { "categoria": 1, "_id": 0 })
        if (!listaCat) return res.status(404).send({ mensaje: 'No hay listado de categorias ' })
        listaCat.forEach(el => !(el in objCat) && (objCat[el] = true) && filtrarCat.push(el))
        return res.send({mensaje: 'ok', filtrarCat})

    },

    /********************************** */
    listarSubCategorias: async (req, res) => {
        const filtrarSubCat = []
        const objSubCat = {}
        const listaSubCat = await Producto.find({}, { "subCategoria": 1, "_id": 0 })
        if (!listaSubCat) return res.status(404).send({ mensaje: 'No hay listado de SubCategorias ' })
        listaSubCat.forEach(el => !(el in objSubCat) && (objSubCat[el] = true) && filtrarSubCat.push(el))
        return res.status(200).send({mensaje: 'ok', filtrarSubCat})
        
    },

    /********************************* */
    mostrarImagen: async (req, res) => {
        var file = req.params.imagen;
        var path_file = 'imgProductos/' + file;

        const exiteImagen = await fs.existsSync(path_file)
        if(!exiteImagen) res.status(404).send({mensaje: 'No existe imagen '})
        res.sendFile(resolve(path_file))
        
    },

    /* **************************** */
    buscar: async (req, res) => {
        var idProd = req.params.id;        

        const findProd = await Producto.findById({_id: idProd})
        if(!findProd) return res.status(404).send({mensaje: 'No existe producto con el id ' + idProd})
        return res.send({mensaje: 'ok', findProd})
        /* pendiente corregir bloqueo de ruta cuando el id no existe */
    },

    /* **************************** */
    actualizarProducto: async (req, res) => {
        var params = req.body;
        var idProducto = req.params.id;

        const actualizaProd = await Producto.findOneAndUpdate({ _id: idProducto}, params, {new: true})
        if(!actualizaProd) return res.status(404).send({mensaje: 'No se pudo actualizar producto ' + idProd})
        return res.send({mensaje: 'ok', actualizaProd })
       
    },

    /* **************************** */
    eliminarProducto: async (req, res) => {
        var idProducto = req.params.id;
        
        const eliminaProd = await Producto.findOneAndDelete({ _id: idProducto })
        if(!eliminaProd) return res.status(404).send({mensaje: 'No se pudo eliminar producto ' + idProd})
        return res.status(200).send({mensaje: 'Producto eliminado correctamente', eliminado: eliminaProd})
        /* pendiente corregir bloqueo de ruta cuando el id no existe */
    },

    /******************************* */
    busqueda: async (req, res) => {
        var variableBusqueda = req.params.var;

        const encontrados = await Producto.find({
            "$or": [
                { "nombre": { "$regex": variableBusqueda, "$options": "i" } },
                { "marca": { "$regex": variableBusqueda, "$options": "i" } },
                { "descripcion": { "$regex": variableBusqueda, "$options": "i" } },
                { "categoria": { "$regex": variableBusqueda, "$options": "i" } },
                { "subCategoria": { "$regex": variableBusqueda, "$options": "i" } }
            ]
        })
        if(!encontrados || encontrados.length == 0) return res.status(404).send({mensaje: 'No se encontraron productos por el parametro '})
        return res.send({mensaje: 'ok', encontrados})
        
    },

    /*************************************** */
    subirImagen: async (req, res) => {
        var idProd = req.params.id;

        prod = new Producto();

        if (req.files.file0.type == null) {
            res.status(400).send({
                mensaje: 'Imagen no subida'
            })
        }

        var rutaArchivo = req.files.file0.path;
        var ext = rutaArchivo.split('.')[1];
        var nomArchivo = rutaArchivo.split('\\')[1]

        if (!(ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png' || ext == 'svg')) res.status(400).send({ mensaje: 'solo imagenes' })

        if (idProd) {
            const uploadImage = await Producto.findOneAndUpdate({ _id: idProd }, { imagen: nomArchivo }, { new: true })
            if (!uploadImage) return res.status(500).send({ mensaje: 'No se encontro el producto'})
            return res.status(200).send({ mensaje: 'imagen subida', imagen: uploadImage })
            // Producto.findOneAndUpdate({ _id: idProd }, { imagen: nomArchivo }, { new: true }, (err, subeImagen) => {
            //     if (err || !subeImagen) {
            //         return res.status(500).send({
            //             mensaje: 'No se encontro el producto',
            //             evento: err
            //         })
            //     }
            //     return res.status(200).send({
            //         mensaje: 'producto actualizado',
            //         imagen: subeImagen
            //     })
            // })
        }
        else {
            return res.status(200).send({
                mensaje: 'producto actualizado',
                imagen: nomArchivo
            })
        }

    },

    /************************** */

};

module.exports = controlador;