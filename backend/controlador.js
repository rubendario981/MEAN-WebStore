'use strict'

var Producto = require('./modeloProducto');
const { query } = require('express');

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

            // Devolver una respuesta 
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