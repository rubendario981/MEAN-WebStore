'use strict'

var valida = require('validator');
var Producto = require('./modeloProducto');

var controlador = {

    crearProducto: (req, res) => {
        var param = req.body;

        try {
            var vNombre = !valida.isEmpty(param.nombre);
            var vMarca = !valida.isEmpty( param.marca)
            var vDescripcion = !valida.isEmpty( param.descripcion);
            var vDescripcion = !valida.isEmpty( param.categoria);
            var vSubCategoria = !valida.isEmpty( param.subCategoria);
            var vPrecio = !valida.isNumeric( param.precio);             

        } catch (error) {
            return res.status(400).send({
                mensaje: 'error en validacion de datos',
                Error: error
            })
        }
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
                return res.status(400).send({
                    mensaje: 'Error al guardar en base de datos '

                });
            }
            return status(200).send({
                mensaje: 'Producto guardado en base de datos!!!',
                producto: productoCreado
            });
        });
    },
    /* **************************** */
    listarProductos: (req, res) => {

        return res.status(200).send({

            nombre: '',
            mensaje: '  '

        });
    },
    /* **************************** */
    buscar: (req, res) => {

        return res.status(200).send({

            nombre: '',
            mensaje: '  '

        });
    },
    /* **************************** */
    actualizarProducto: (req, res) => {

        return res.status(200).send({

            nombre: '',
            mensaje: ''

        });
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