'use strict'
var Product= require('../models/product');
var fs = require('fs');
var path = require('path');
var controller = {
    home: function(req, res){
        return res.status(200).send({
            message: 'Soy la home'
        });
    },
    test: function(req,res){
        return res.status(200).send({
            message: 'Soy el metodo o accion test del controlador de producto'
        });
    },
    //metodo para guardar un producto
    saveProduct: function(req, res){
        var producto = new Product();
        var params = req.body;
        //principal
        producto.nombre = params.nombre;
        producto.descripcion = params.descripcion;
        producto.categoria = params.categoria;
        producto.precio = params.precio;
        producto.stock = params.stock;
        producto.imagen = null;
        //general
        producto.color = params.color;
        producto.ram = params.ram;
        producto.rom = params.rom;
        producto.pantalla = params.pantalla;
        producto.resolucion = params.resolucion;
        producto.bateria = params.bateria;
        producto.camaraf = params.camaraf;
        producto.camarap = params.camarap;
        //especifico
        producto.modeloproducto = params.modelo;
        producto.tipopantalla = params.tipopantalla;
        producto.tipoentrada = params.tipoentrada;
        producto.sistemaoperativo = params.sistemaoperativo;
        producto.procesador = params.procesador;
        producto.peso = params.peso;
        producto.alto = params.alto;
        producto.ancho = params.ancho;
        producto.profundidad = params.profundidad;
        producto.save((err, productoStored) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento'});
            if(!productoStored) return res.status(404).send({message: 'No se ha podido guardar el producto'});
            return res.status(200).send({producto: productoStored});
        });
    },
    //metodo para obtener un producto
    getProduct: function(req, res){
        var productId = req.params.id;
        if(productId == null) return res.status(404).send({message: 'El producto no existe'});
        Product.findById(productId, (err, producto) => {
            if(err) return res.status(500).send({message: 'Error al devolver los datos'});
            if(!producto) return res.status(404).send({message: 'El producto no existe'});
            return res.status(200).send({producto});
        });
    },
    //metodo para obtener todos los productos
    getProducts: function(req, res){
        Product.find({}).exec((err, productos) => {
            if(err) return res.status(500).send({message: 'Error al devolver los datos'});
            if(!productos) return res.status(404).send({message: 'No hay productos para mostrar'});
            return res.status(200).send({productos});
        });
    },
    //metodo para actualizar un producto
    updateProduct: function(req, res){
        var productId = req.params.id;
        var update = req.body;
        Product.findByIdAndUpdate(productId, update, {new:true}, (err, productoUpdated) => {
            if(err) return res.status(500).send({message: 'Error al actualizar'});
            if(!productoUpdated) return res.status(404).send({message: 'No existe el producto para actualizar'});
            return res.status(200).send({producto: productoUpdated});
        });
    },
    //metodo para eliminar un producto
    deleteProduct: function(req, res){
        var productId = req.params.id;
        Product.findByIdAndRemove(productId, (err, productoRemoved) => {
            if(err) return res.status(500).send({message: 'No se ha podido borrar el producto'});
            if(!productoRemoved) return res.status(404).send({message: 'No se puede eliminar ese producto'});
            return res.status(200).send({producto: productoRemoved});
        });
    },
    //metodo para subir una imagen
    uploadImage: function(req, res){
        var productId = req.params.id;
        var fileName = 'Imagen no subida...';
        console.log(req.files);
        if(req.files){
            var filePath = req.files.imagen.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];
            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Product.findByIdAndUpdate(productId, {imagen: fileName}, {new:true}, (err, productoUpdated) => {
                    if(err) return res.status(500).send({message: 'La imagen no se ha subido'});
                    if(!productoUpdated) return res.status(404).send({message: 'El producto no existe y no se ha asignado la imagen'});
                    return res.status(200).send({producto: productoUpdated});
                });
            }else{
                fs.unlink(filePath, (err) => {
                    return res.status(200).send({message: 'La extension no es valida'});
                });
            }
        }else{
            return res.status(200).send({message: fileName});
        }
    },
    //metodo para obtener una imagen
    getImageFile: function(req, res){
        var file = req.params.image;
        var path_file = './uploads/'+file;
        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({message: 'No existe la imagen'});
            }
        });
    },
    //metodo para buscar productos
    search: function(req, res){
        var searchString = req.params.search;
        Product.find({ "$or": [
            { "nombre": { "$regex": searchString, "$options": "i" } },
            { "descripcion": { "$regex": searchString, "$options": "i" } },
            { "marca": { "$regex": searchString, "$options": "i" } }
        ]})
        .sort([['marca', 'descending']])
        .exec((err, productos) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!productos) return res.status(404).send({message: 'No hay productos que coincidan con la busqueda'});
            return res.status(200).send({productos});
        });
    },
    //metodo para buscar productos por marca
    searchMarca: function(req, res){
        var searchString = req.params.search;
        Product.find({ "marca": { "$regex": searchString, "$options": "i" } })
        .sort([['marca', 'descending']])
        .exec((err, productos) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!productos) return res.status(404).send({message: 'No hay productos que coincidan con la busqueda'});
            return res.status(200).send({productos});
        });
    },
    //metodo para buscar productos por nombre
    searchNombre: function(req, res){
        var searchString = req.params.search;
        Product.find({ "nombre": { "$regex": searchString, "$options": "i" } })
        .sort([['marca', 'descending']])
        .exec((err, productos) => {
            if(err) return res.status(500).send({message: 'Error en la peticion'});
            if(!productos) return res.status(404).send({message: 'No hay productos que coincidan con la busqueda'});
            return res.status(200).send({productos});
        });
    },
};

module.exports= controller;