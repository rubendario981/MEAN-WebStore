'use strict'

var Producto = require('./modeloProducto');
var fs = require('fs');
const { resolve } = require('path');

var controlador = {
    crearProducto: (req, res) => {
        // Recoger parametros por post
        var params = req.body;

        //Crear el objeto a guardar
        var prod = new Producto();

        // Asignar valores
        prod.nombre = params.nombre;
        prod.marca = params.marca;
        prod.descripcion = params.descripcion;
        prod.categoria = params.categoria
        prod.subCategoria = params.subCategoria;
        prod.precio = params.precio;

        // Guardar el articulo
        prod.save((err, productoCreado) => {

            if (err || !productoCreado) {
                return res.status(404).send({
                    mensaje: 'Algun dato invalido'
                });
            }

            return res.status(200).send({
                mensaje: 'success',
                prod: productoCreado
            });

        });

    },

    /* **************************** */
    listarProductos: (req, res) => {
        Producto.find({}).exec((err, productos) => {
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
        });
    },

    listarCategorias: (req, res)=>{  
        var misCat =[];
        Producto.find({categoria: 'Tecnologia'}).exec((err, lista)=>{
            if(err) return console.log('paila bebe ' + err)
            return res.status(200).send({
                lista
            })
        })
        
    },

    /********************************* */
    mostrarImagen: (req, res) => {
        var file = req.params.imagen;
        var path_file = 'imgProductos/' +file;        

        fs.exists(path_file,(exists) => {
            if(exists){
                return res.sendFile(resolve(path_file));
                
            }else{
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
        console.log('parametro es: ' + idProd)

        Producto.findById(idProd, (err, prod) => {            
            if (err || !prod) {
                return res.status(500).send({
                    mensaje: 'Producto no encontrado'
                })
            } else{
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
        var params = req.body;
        var idProducto = req.params.id;

        Producto.findOneAndDelete({_id: idProducto}, (err, delProd)=>{
            if(err){
                return res.status(400).send({
                    mensaje: 'no se puede eliminar porque no existe'
                })
            }
            return res.status(200).send({
                mensaje: 'Producto eliminado correctamente',
                eliminado: delProd
            })
        })
    },

    /******************************* */
    busqueda: (req, res)=>{
        var variableBusqueda = req.params.var;
        
        
        Producto.find({ "$or": [ 
            { "nombre": { "$regex": variableBusqueda, "$options": "i"}},
            { "marca": { "$regex": variableBusqueda, "$options": "i"}},
            { "descripcion": { "$regex": variableBusqueda, "$options": "i"}},
            { "categoria": { "$regex": variableBusqueda, "$options": "i"}},
            { "subCategoria": { "$regex": variableBusqueda, "$options": "i"}}        
        ]}).exec((err, encontrados)=>{
            if(err){
                return res.status(400).send({
                    mensaje: 'mala peticion del comando'
                })
            }
            if(!encontrados || encontrados.length <= 0){
                return res.status(500).send({
                    mensaje: 'no se encontraron articulos'
                })
            }
            if(encontrados.length >= 1){
                return res.status(200).send({
                    mensaje: 'ok',
                    productos: encontrados
                })
            }
        })
    },

    /*************************************** */
    subirImagen: (req, res)=>{
        var idProd = req.params.id;

        if(req.files.file0.type == null){
            return res.status(400).send({
                mensaje: 'Imagen no subida'
            })
        }

        var rutaArchivo = req.files.file0.path;
        var ext = rutaArchivo.split('.')[1];
        var nomArchivo = rutaArchivo.split('\\')[1]
        console.log('el nombre del archivo es ' + nomArchivo)
        
        if(!(ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'png' || ext == 'svg')){
            return res.status(400).send({
                mensaje: 'solo imagenes',
            })
        }

        Producto.findOneAndUpdate({_id: idProd}, {imagen: nomArchivo}, {new: true}, (err, prodEncotrado)=>{
            if(err || !prodEncotrado){
                return res.status(500).send({
                    mensaje: 'No se encontro el producto',
                    evento: err
                })
            }
            return res.status(200).send({
                mensaje: 'producto actualizado',
                DatosActualizados: prodEncotrado
            })
        })
    }, 
    
    /************************** */
    
};

module.exports = controlador;