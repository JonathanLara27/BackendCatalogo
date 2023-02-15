var User= require('../models/Administrador');
//Requerimos el módulo para generar token de autorización
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
var controller ={

    home: function(req, res){
        return res.status(200).send({
            message: 'Soy la home'
        });
    },

    test: function(req,res){
        return res.status(200).send({
            message: 'Soy el metodo o accion test del controlador de usuario'
        });
    },
    mostrarAdministradores : function(req, res){
        User.find({}).exec((err, data) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!data) return res.status(404).send({message: 'No hay usuarios'});
            User.countDocuments({}, (err, total) => {
                if(err) return res.status(500).send({message: 'Error en la peticion'});
                return res.json({
                    status: 200,
                    total,
                    data
                });
            });
        });
    },
    crearAdministrador: function(req, res){
    let params = req.body;
    let user = new User();
    user.user = params.user.toLowerCase();
    user.password = bcrypt.hashSync(params.password, bcrypt.genSaltSync(10));
    user.save((err, data) => {
        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
        if(!data) return res.status(404).send({message: 'No se ha registrado el usuario'});
        return res.json({
            status: 200,
            data,
            message: 'Usuario creado correctamente'
        });
    });
    },
    editarAdministrador: function(req, res){
        let userId = req.params.id;
        let update = req.body;
        User.findById(userId, (err, data) => {
            if(err) return res.json({status: 500, message: 'Error en la peticion', err});
            if(!data) return res.json({status: 400, message: 'El usuario no existe'});
            let password = update.password;
            //validamos que exista el password en el body
            if(password){
                //verificamos que el password sea diferente al que ya tiene el usuario
                if(bcrypt.compareSync(password, data.password)){
                    return res.json({status: 200, message: 'El password es igual al anterior'});
                }
                else{
                    //actualizamos el usuario
                    let updateUser = {
                        user: update.user.toLowerCase(),
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    }
                    User.findByIdAndUpdate(userId, updateUser, {new: true}, (err, data) => {
                        if(err) return res.json({status: 500, message: 'Error en la peticion', err});
                        if(!data) return res.json({status: 400, message: 'El usuario no existe'});
                        return res.json({status: 200, data, message: 'Usuario actualizado correctamente'});
                    });
                }
            }

        });
    },
    eliminarAdministrador: function(req, res){
        let userId = req.params.id;
        User.findByIdAndRemove(userId, (err, data) => {
            //contamos los usuarios
            User.countDocuments({}, (err, total) => {
                if(Number(total)==1){
                    return res.json({status: 200, message: 'No se puede eliminar el unico usuario'});
                }
                else{
                    if(err) return res.json({status: 500, message: 'Error en la peticion', err});
                    if(!data) return res.json({status: 400, message: 'El usuario no existe'});
                    return res.json({status: 200, data, message: 'Usuario eliminado correctamente'});
                }
            });
        });
        
    },
    login : function(req, res){
        let params = req.body;
        let user = params.user.toLowerCase();
        let password = params.password;
        User.findOne({ user: user }, (err, data) => {
            if(err) return res.json({status: 500, message: 'Error en la peticion', err});
            if(!data) return res.json({status: 400, message: 'El usuario no existe'});
            if(!bcrypt.compareSync(password,data.password)) return res.json({status: 400, message: 'El password es incorrecto'});
            if(data){
                //generar y devolver token
                let token= jwt.sign({data},process.env.SECRET,{ expiresIn: '1h' });
                return res.json({
                    status: 200,
                    data,
                    token
                });
            }
        });
    },

};

module.exports = controller;