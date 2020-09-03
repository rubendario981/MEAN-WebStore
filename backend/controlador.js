'use strict'

var Producto = require('./modeloProducto');
var Categorias = require('./modeloCategoria');
var Usuario = require('./modeloUsuario');
var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt');
var fs = require('fs');
const { resolve } = require('path');
var cat = new Categorias();
var usu;
var prod;

var controlador = {
    /***************************** */
    registroUsuario: (req, res, next) => {
        var params = req.body;
        usu = new Usuario();
        usu.nombres = params.nombres;
        usu.nickName = params.nickName;
        usu.correo = params.correo;
        usu.password = usu.encriptaPass(params.clave)
        usu.rol = params.rol;

        Usuario.findOne({'correo': params.correo}).exec((error, correoEncontrado)=>{
            if(error) res.send({error})
            if(correoEncontrado) res.send({mensaje: 'Ya estas registrado'})
            if(!correoEncontrado){
                Usuario.findOne({'nickName': params.nickName}).exec((error, nickEncontrado)=>{
                    if(error) res.send({error})
                    if(nickEncontrado) res.send({mensaje: 'Ya existe el nickName, escoje otro'})
                    if(!nickEncontrado){
                        usu.save((error, usuCreado) => {
                            if (error || !usuCreado) res.send({ error })
                            return res.send({ usuCreado })
                        })
                    }
                })
            }
        })  
    },
    /***************************** */
    inicioSesion: (req, res, next) => {
        var params = req.body;
        usu = new Usuario();
        usu.nickName = params.nickName;
        //usu.password = params.clave;
       
        Usuario.findOne({'nickName': usu.nickName}).exec((error, nickEncontrado)=>{
            error || !nickEncontrado ? res.status(400).send({mensaje: 'no se pudo encontrat'}) : 
            nickEncontrado == null ? res.status(500).send({mensaje: 'consulta con resultados nulos'}) :
            bcrypt.compareSync(params.clave, nickEncontrado.password) ? res.status(200).send({nickEncontrado}) :
            res.send({mensaje: 'ingreso imposible'})                    
        })
    },
    /***************************** */
    crearCategoria: (req, res) => {
        var params = req.body;
        cat.categoria = params.categoria;
        cat.save((err, categoriaNueva) => {
            if (err || categoriaNueva == undefined) console.log('error al crear categoria' + err)
            return res.status(200).send({
                mensaje: 'ok',
                newCat: categoriaNueva
            });
        });
    },

    /***************************** */
    crearSubCategoria: (req, res) => {
        var params = req.body;
        cat.categoria = params.categoria;
        cat.subCategoria = params.subCategoria;
        cat.save((err, subCategoriaNueva) => {
            if (err) console.log('error al obtener categoria' + err)

            return res.status(200).send({
                mensaje: 'ok',
                newCat: subCategoriaNueva
            });
        });
    },

    /***************************** */
    crearProducto: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        //Crear objetos para guardar en Bd
        prod = new Producto();
        // Asignar valores
        prod.nombre = params.nombre;
        prod.marca = params.marca;
        prod.descripcion = params.descripcion;
        prod.categoria = params.categoria;
        prod.subCategoria = params.subCategoria;
        prod.precio = params.precio;
        prod.imagen = params.imagen;
        // Guardar el articulo
        prod.save((err, productoCreado) => {
            if (err || !productoCreado) {
                return res.status(404).send({
                    mensaje: 'Algun dato invalido'
                });
            }
            return res.status(200).send({
                mensaje: 'ok',
                prod: productoCreado
            });
        });
    },

    /* **************************** */
    listarProductos: (req, res) => {
        Producto.find({}).sort({ fecha: -1 }).exec((err, productos) => {
            if (err) {
                return res.status(500).send({
                    mensaje: 'error en consulta',
                });
            }
            if (!productos || productos.length === 0) {
                return res.status(404).send({
                    mensaje: 'No hay productos en base de datos'
                })
            }
            return res.status(200).send({
                mensaje: 'ok',
                productos
            })
        })
    },

    /* **************************** */
    detalleProducto: (req, res) => {
        var params = req.body
        prod.id = params.id

        Producto.findById({})

        return res.status(200).send({ mensaje: prod })
    },

    /************************************** */
    listarCategorias: (req, res) => {
        const filtrarCat = []
        const objCat = {}
        Producto.find({}, { "categoria": 1, "_id": 0 }).exec((err, listaCat) => {
            if (err) res.status(400)
            if (listaCat) {
                listaCat.forEach(el => !(el in objCat) && (objCat[el] = true) && filtrarCat.push(el))
                return res.status(200).send({
                    mensaje: 'ok',
                    filtrarCat
                })
            }
        })
    },

    /********************************** */
    listarSubCategorias: (req, res) => {
        const filtrarSubCat = []
        const objSubCat = {}
        Producto.find({}, { "subCategoria": 1, "_id": 0 }).exec((err, listaSubCat) => {
            if (err) res.status(400)
            if (listaSubCat) {
                listaSubCat.forEach(el => !(el in objSubCat) && (objSubCat[el] = true) && filtrarSubCat.push(el))
                return res.status(200).send({
                    mensaje: 'ok',
                    filtrarSubCat
                })
            }
        })
    },

    /********************************* */
    mostrarImagen: (req, res) => {
        var file = req.params.imagen;
        var path_file = 'imgProductos/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(resolve(path_file));

            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!',
                    ruta: path_file
                });
            }
        });
    },

    /* **************************** */
    buscar: (req, res) => {
        var idProd = req.params.id;
        //console.log('parametro es: ' + idProd)

        Producto.findById(idProd, (err, prod) => {
            if (err || !prod) {
                return res.status(500).send({
                    mensaje: 'Producto no encontrado'
                })
            } else {
                return res.status(200).send({
                    mensaje: 'ok',
                    prod
                })
            }
        })
    },

    /* **************************** */
    actualizarProducto: (req, res) => {
        var params = req.body;
        var idProducto = req.params.id;

        Producto.findOneAndUpdate({ _id: idProducto },
            params, { new: true }, (err, actualizaProducto) => {
                if (err) {
                    return res.status(400).send({
                        mensaje: 'Falla al buscar id producto'
                    });
                }
                return res.status(200).send({
                    mensaje: ' Se pudo actualizar producto en bd ',
                    prod: actualizaProducto
                });
            })
    },

    /* **************************** */
    eliminarProducto: (req, res) => {
        //var params = req.body;
        var idProducto = req.params.id;

        Producto.findOneAndDelete({ _id: idProducto }, (err, delProd) => {
            if (err) {
                return res.status(400).send({
                    mensaje: 'no se puede eliminar porque no existe'
                })
            }
            if (delProd) {
                return res.status(200).send({
                    mensaje: 'Producto eliminado correctamente',
                    eliminado: delProd
                })
            }

        })
    },

    /******************************* */
    busqueda: (req, res) => {
        var variableBusqueda = req.params.var;

        Producto.find({
            "$or": [
                { "nombre": { "$regex": variableBusqueda, "$options": "i" } },
                { "marca": { "$regex": variableBusqueda, "$options": "i" } },
                { "descripcion": { "$regex": variableBusqueda, "$options": "i" } },
                { "categoria": { "$regex": variableBusqueda, "$options": "i" } },
                { "subCategoria": { "$regex": variableBusqueda, "$options": "i" } }
            ]
        }).exec((err, encontrados) => {
            if (err) {
                return res.status(400).send({
                    mensaje: 'mala peticion del comando'
                })
            }
            if (!encontrados || encontrados.length <= 0) {
                return res.status(500).send({
                    mensaje: 'no se encontraron articulos'
                })
            }
            if (encontrados.length >= 1) {
                return res.status(200).send({
                    mensaje: 'ok',
                    encontrados
                })
            }
        })
    },

    /*************************************** */
    subirImagen: (req, res) => {
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
            Producto.findOneAndUpdate({ _id: idProd }, { imagen: nomArchivo }, { new: true }, (err, subeImagen) => {
                if (err || !subeImagen) {
                    return res.status(500).send({
                        mensaje: 'No se encontro el producto',
                        evento: err
                    })
                }
                return res.status(200).send({
                    mensaje: 'producto actualizado',
                    imagen: subeImagen
                })
            })
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