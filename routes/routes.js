'use strict'

var express = require('express');
var ProductController = require('../controllers/product');
var UserController= require('../controllers/user');

//importamos el middelware
const { verificarToken } = require('../middlewares/autenticacion');


var router = express.Router();
//para subir archivos
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './uploads'});

//PRODUCT

router.get('/', ProductController.home);
router.post('/test', ProductController.test);
//para guardar un producto
router.post('/save-product',verificarToken, ProductController.saveProduct);
//para obtener un producto
router.get('/product/:id?', ProductController.getProduct);
//para obtener todos los productos
router.get('/products', ProductController.getProducts);
//para actualizar un producto
router.put('/product/:id',verificarToken, ProductController.updateProduct);
//para eliminar un producto
router.delete('/product/:id',verificarToken, ProductController.deleteProduct);
//para subir una imagen
router.post('/upload-image/:id', multipartMiddleware, ProductController.uploadImage);
//para obtener una imagen
router.get('/get-image/:image', ProductController.getImageFile);
//para buscar un producto
router.get('/products/:search', ProductController.search);

//USER

router.get('/user', UserController.home);
router.post('/user/test', UserController.test);

router.post('/user/registraradmin',verificarToken,UserController.crearAdministrador);
router.post('/user/login', UserController.login);
router.get('/user/administradores', UserController.mostrarAdministradores);
router.put('/user/editaradmin/:id',verificarToken, UserController.editarAdministrador);
router.delete('/user/eliminaradmin/:id',verificarToken, UserController.eliminarAdministrador);

module.exports = router;