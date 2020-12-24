'use strict'

var Producto = require('./modeloProducto');
var Categorias = require('./modeloCategoria');
var Usuario = require('./modeloUsuario');
var bcrypt = require('bcrypt');
var JWT = require('jsonwebtoken')
var fs = require('fs');
const { resolve } = require('path');
var cat;
var prod, token, usu;

var controlador = {
    /***************************** */
    registroUsuario: async (req, res, next) => {
        var params = req.body;
        usu = new Usuario();
        usu.nombres = params.nombres;
        usu.nickName = params.nickName;
        usu.correo = params.correo;
        usu.password = usu.encriptaPass(params.password)
        usu.rol = params.rol;

        if (!params.rol) usu.rol = 'cliente'

        const emailFound = await Usuario.findOne({ correo: params.correo })
        if (emailFound) return res.status(400).send({ mensaje: 'Ya esta registrado ' + emailFound.correo })
        if (!emailFound) {
            const nickFound = await Usuario.findOne({ nickName: params.nickName })
            if (nickFound) res.status(400).send({ mensaje: 'Ya existe el nickName ' + nickFound.nickName + ' escoje otro' })
            if (!nickFound) {
                const userCreated = await usu.save()
                if (!userCreated) {
                    return res.status(404).send({ mensaje: 'no se pudo crear usuario' })                    
                }
                token = JWT.sign({ id: userCreated._id }, 'eres un secreto', { expiresIn: 86400 })
                res.send({ mensaje: 'ok', token })                
            }
        }
    },
    
    /***************************** */
    inicioSesion: async (req, res, next) => {
        const { correo, password } = req.body;

        const userFound = await Usuario.findOne({ correo: correo })
        if (!userFound) return res.status(404).send({ mensaje: 'usuario no existe ' })

        const passIsValid = bcrypt.compareSync(password, userFound.password)
        if (!passIsValid) res.status(401).send({ mensaje: 'Contraseña invalida ' })

        const token = JWT.sign({ id: userFound._id }, 'eres un secreto', { expiresIn: 86400 })
        res.send({ mensaje: 'ok', token })

    },

    /***************************** */
    identificarUsuario: async(req, res)  =>{
        const idUsuario = req.params.id

        const findUser = await Usuario.findById({_id: idUsuario})
        if(!findUser) return res.status(404).send({mensaje: 'No encontrado usuario'})
        return res.send({mensaje: 'ok', findUser, rol: findUser.rol})
    },
    
    /***************************** */
    eliminarUsuario: async(req, res)  =>{
        const idUsuario = req.params.id

        const delUser = await Usuario.findByIdAndDelete({_id: idUsuario})
        if(!delUser) return res.status(404).send({mensaje: 'No se elimino usuario'})
        return res.send({mensaje: 'ok', delUser})
    },
    
    /***************************** */
    crearCategoria: async (req, res) => {
        cat = new Categorias()
        cat.categoria = req.body.categoria
        console.log(req.body.categoria)
        
        const findCat = await Categorias.findOne({ categoria: req.body.categoria })
        if (findCat) return res.status(402).send({ mensaje: 'ya existe la categoria ' })
        const newCategory = await cat.save()
        if (!newCategory) return res.status(404).send({ mensaje: 'No se pudo crear la nueva categoria' })
        return res.send({ mensaje: 'ok', newCategory })
    },

    /***************************** */
    crearSubCategoria: async (req, res) => {
        const { categoria, subCategoria } = req.body;

        const existeSubCat = await Categorias.findOne({categoria, subCategoria: subCategoria})
        if(existeSubCat) return res.status(402).send({mensaje: `ya existe ${subCategoria} dentro de la categoria ${categoria}`})
        const crearSubCategoria = await Categorias.findOneAndUpdate({categoria}, {$push:{"subCategoria": subCategoria}}, {new: true})
        crearSubCategoria ? res.status(200).send({mensaje: 'ok', crearSubCategoria}) : res.status(404).send({mensaje: 'no se pudo crear subCat'})

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
        prod.precioPromo = params.precioPromo
        prod.tiempoPromo = params.tiempoPromo

        const productCreated = await prod.save()
        if (!productCreated) res.status(404).send({ mensaje: 'No se pudo crear el producto' })
        return res.send({ mensaje: 'ok', productCreated })

    },

    /* **************************** */
    listarProductos: async (req, res) => {

        const listaProductos = await Producto.find({}).sort({ fecha: -1 })
        if (!listaProductos) return res.status(404).send({ mensaje: 'De momento no se pueden listar productos' })
        res.send({ mensaje: 'ok', listaProductos })

    },

    /* **************************** */
    detalleProducto: (req, res) => {
        var idProducto = req.params.id
        Producto.findById({ _id: idProducto }).exec((err, prod)=>{
            if(err || !prod) return res.status(404).send({mensaje: 'No se encontro el producto'})
            return res.send({mensaje: 'ok', prod})
        })
    },

    /************************************** */
    listarCategorias: async (req, res) => {        
        const listCategories = await Categorias.find({}, {categoria: 1, subCategoria: 1})
        !listCategories ? res.status(404).send({mensaje: 'No hay listado de categorias'}):
        res.status(200).send({mensaje: 'ok', listCategories})
    },
    
    /************************************** */
    listarCategoriasNuevas: async (req, res) => {        
        const listaCat = await Categorias.find({}, { categoria: 1, _id: 0 })
        if (!listaCat) return res.status(404).send({ mensaje: 'No hay listado de categorias ' })
        return res.send({mensaje: 'ok', listaCat})
    },

    /********************************** */
    listarTags: async (req, res) => {
        const listado = [];
        const objLista = {}
        const listaTags = await Producto.find({}, { subCategoria: 1, _id: 0 })
        if (!listaTags) return res.status(404).send({ mensaje: 'No hay listado de SubCategorias ' })
        listaTags.forEach(el => !(el in objLista) && (objLista[el] = true) && listado.push(el));
        
        return res.send({mensaje: 'ok', listado})
    },

    /************************************ */
    listarSubCategorias: async (req, res) => {        
        const listaSubCat = await Categorias.findOne({categoria: req.params.cat}, { subCategoria: 1, _id: 0 })
        if (!listaSubCat) return res.status(404).send({ mensaje: 'No hay listado de SubCategorias ' })
        
        return res.send({mensaje: 'ok', listaSubCat})
    },

    /************************************ */
    eliminarCategoria: async (req, res) => {
        const params = req.body
        const categoriaVacia = await Producto.find({categoria: req.params.cat})
        if(categoriaVacia.length == 0) {
            const eliminaCat = await Categorias.findOneAndDelete({categoria: req.params.cat})
            if(!eliminaCat) return res.status(400).send({mensaje:'No se pudo eliminar categoria'})
            res.send({mensaje: 'categoria eliminada' })
        }
        else{
            res.send({mensaje: 'ok', longitud: categoriaVacia.length})
        }        
    },

    /********************************** */
    validaFav: async (req, res) => {
        var params = req.body
        var idUsuario = req.params.id        

        const validarFav = await Usuario.findById({_id: idUsuario}, {listaFavoritos: 1, _id:0})
        res.send({mensaje: 'ok',  validarFav})
        
    },

    /********************************** */
    agregaFav: async (req, res) => {
        var params = req.body
        var idUsuario = req.params.idUsuario
        
        const listaFav = await Usuario.findOneAndUpdate({_id: idUsuario}, {$push:{"listaFavoritos": params.listaFavoritos}}, {new: true})
        res.send({mensaje: 'ok', listaFav})        
    },

    /********************************** */
    borrarFav: async (req, res) => {
        var params = req.body
        var idUsuario = req.params.idUsuario
        
        const borraFav = await Usuario.findOneAndUpdate({_id: idUsuario}, {$pull:{"listaFavoritos": params.listaFavoritos}}, {new: true})        
        res.send({mensaje: 'ok', borraFav})        
    },

    /********************************** */
    borrarTodoFav: async (req, res) => {
        var idUsuario = req.params.idUsuario
        
        const borraListaFav = await Usuario.findOneAndUpdate({_id: idUsuario}, {listaFavoritos: []}, {new: true})        
        res.send({mensaje: 'ok', borraListaFav})        
    },

    /********************************** */
    agregarCarrito: async (req, res) => {
        var params = req.body
        var idUsuario = req.params.idUsuario

        const listaCompras = await Usuario.findById({_id: idUsuario}, {_id: 0, listaCompras: 1})
        if(!Object.values(listaCompras.listaCompras).includes(params.listaCompras)){
            const addCart = await Usuario.findOneAndUpdate({_id: idUsuario}, {$push:{"listaCompras": params.listaCompras}}, {new: true})        
            return res.send({mensaje: 'ok', addCart})
        }
    },

    /********************************** */
    borrarCarrito: async (req, res) => {
        var params = req.body
        var idUsuario = req.params.idUsuario
        
        const delCart = await Usuario.findOneAndUpdate({_id: idUsuario}, {$pull:{"listaCompras": params.listaCompras}}, {new: true})        
        return res.send({mensaje: 'ok', delCart})        
    },

    /********************************** */
    vaciarCarrito: async (req, res) => {
        var idUsuario = req.params.idUsuario
        
        const emptyCart = await Usuario.findOneAndUpdate({_id: idUsuario}, {listaCompras: []}, {new: true})        
        return res.send({mensaje: 'ok', emptyCart})        
    },

    /********************************* */
    mostrarImagen: async (req, res) => {
        var file = req.params.imagen;
        var path_file = 'imgProductos/' + file;

        const existeImagen = await fs.existsSync(path_file)
        if(!existeImagen) res.status(404).send({mensaje: 'No existe imagen '})
        return res.sendFile(resolve(path_file))
        
    },

    /* **************************** */
    buscar: async (req, res) => {
        var idProd = req.params.id;        
        try {
            const findProd = await Producto.findById({_id: idProd})
            return res.send({mensaje: 'ok', findProd})
            
        } catch (error) {
            return res.status(500).send({mensaje: 'No se pudo resolver promesa', error})
        }
    },

    /* **************************** */
    actualizarProducto: (req, res) => {
        var params = req.body
        var idProducto = req.params.id;
        Producto.findOneAndUpdate({_id: idProducto }, params, { new: true }).exec((err, actualizado)=>{
            if(err) return res.status(500).send({mensaje:'error', err})
            if(!actualizado) return res.status(404).send({mensaje:'No actualizado'})
            return res.send({mensaje: 'ok', actualizado})
        })       
    },

    /* **************************** */
    eliminarProducto: async (req, res) => {
        var idProducto = req.params.id;
        try {
            const eliminaProd = await Producto.findOneAndDelete({ _id: idProducto })
            if(!eliminaProd) return res.status(404).send({mensaje: 'No se pudo eliminar producto '})
            return res.status(200).send({mensaje: 'ok', eliminado: eliminaProd})
            
        } catch (error) {
            return res.status(500).send({mensaje: 'No se pudo manejar promesa '})
            
        }
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
            try {
                const uploadImage = await Producto.findOneAndUpdate({ _id: idProd }, { imagen: nomArchivo }, { new: true })
                if (!uploadImage) return res.status(500).send({ mensaje: 'No se encontro el producto'})
                return res.status(200).send({ mensaje: 'imagen subida', imagen: uploadImage })
                
            } catch (error) {
                return res.status(500).send({mensaje: 'No valido el parametro'})
            }
            
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