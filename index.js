'use strict'
//cargamos el servidor de express
var app = require('./app');
app.set('port', process.env.PORT || 3000);
require('dotenv').config();
var mongoose = require('mongoose');
var ip=require('ip');
//conexion a la base de datos LOCAL
/*

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/CatalogoProductos').then(() => {
    console.log("La conexión a la base de datos se ha realizado correctamente");
    //creamos el servidor
    app.listen(port, () => {
        console.log("Servidor corriendo en http://localhost:" + port);
    });
}
).catch(err => console.log(err));
*/

//conexion a la base de datos remota
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("La conexión a la base de datos de mongoDB ATLAS se ha realizado correctamente");
    //creamos el servidor, dentro de la conexión ya es una api rest
    app.listen(app.get('port'), () => {
        console.log("Servidor corriendo en http://localhost:" + app.get('port'));
        console.log("Servidor corriendo en http://"+ip.address()+":" + app.get('port'));
    });
}
).catch(err => console.log(err));

