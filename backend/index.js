'use strict'

var  mongoose = require("mongoose");
var server = require('./server');
server.set('port', process.env.port || 3000);

mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/bdWebStore', {useNewUrlParser: true})
    .then(()=>{
        console.log('Conexion a base de datos exitosa');

        //Implementacion del servidor
        server.listen(server.get('port'), ()=>{
            console.log(`Servidor corriendo en puerto => ${server.get('port')}`);
        })
    }).catch(()=>{
        console.log('No se pudo conectar a la base de datos ', error);
});
