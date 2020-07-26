'use strict'

var valida = require('validator');
var Producto = require('./modeloProducto');

var controlador = {
    crearProducto: (req, res) => {
        var param = req.body;
        try {
            var vNombre = !valida.isEmpty(param.nombre);
            var vMarca = !valida.isEmpty(param.marca)
            var vDescripcion = !valida.isEmpty(param.descripcion);
            var vCategoria = !valida.isEmpty(param.categoria);
            var vSubCategoria = !valida.isEmpty(param.subCategoria);
            var vPrecio = !valida.isNumeric(param.precio);

        } catch (error) {
            return res.status(400).send({
                mensaje: 'error en validacion de datos'
            });
        }

        if (vNombre && vMarca && vDescripcion && vCategoria && vSubCategoria && vPrecio) {
            //creacion de objeto para guardar producto en base de datos            
            var producto = new Producto();
            producto.nombre = param.nombre;
            producto.marca = param.marca;
            producto.descripcion = param.descripcion;
            producto.categoria = param.categoria;
            producto.subCategoria = param.subCategoria;
            producto.precio = param.precio;

            //si todo es valido guardar en bdMongo
            producto.save((err, productoCreado) => {
                if (err || !productoCreado) {
                    return res.status(404).send({
                        mensaje: 'Error al guardar en base de datos'
                    });
                }
                //si no hay error
                return res.status(200).send({
                    mensaje: 'ok',
                    productoCreado
                });
            });
        } 
        else {
            return res.status(400).send({
                mensaje: 'Falla en algun dato, no se ha creado el producto'
            });
        }
    },
    /* **************************** */
    listarProductos: (req, res) => {
        Producto.find({}).exec((err, productos)=>{
            if(err){
                return res.status(500).send({
                    mensaje: 'error en consulta',
                });                
            }
            if(!productos || productos.length === 0){
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
    buscar: (req, res) => {
        return res.status(200).send({

            nombre: '',
            mensaje: ''

        });
        

    },
    /* **************************** */
    actualizarProducto: (req, res) => {
        var param = req.body;
        var idProducto = param.id;

        Producto.findOneAndUpdate({ _id: idProducto },
            param, { new: true }, (err, actualizaProducto) => {
                if (err) {
                    return res.status(400).send({
                        mensaje: 'Falla al buscar id producto'
                    });
                }
                return res.status(200).send({
                    nombre: 'gatito',
                    mensaje: ' Se pudo actualizar producto en bd ',
                    actualizaProducto

                });

            })

    },
    /* **************************** */
    eliminarProducto: (req, res) => {

        return res.status(200).send({

            nombre: '',
            mensaje: ''

        });
    },
};

module.exports = controlador;