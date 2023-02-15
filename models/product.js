'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medidasSchema= Schema({
  alto: Number,
  ancho: Number,
  profundidad: Number
});

var principalSchema= Schema({
  nombre: String,
  descripcion: String,
  categoria: String,
  precio: Number,
  stock: Number,
  imagen: String
});

var generalSchema= Schema({
  color: String,
  ram: Number,
  rom: Number,
  pantalla: Number,
  resolucion: String,
  bateria: Number,
  camaraf: String,
  camarap: String,
  marca: String
});

var especificoSchema= Schema({
  modeloproducto: String,
  tipopantalla: String,
  tipoentrada: String,
  sistemaoperativo: String,
  procesador: String,
  peso: Number,
  alto: Number,
  ancho: Number,
  profundidad: Number
});


var ProductSchema = Schema({
  _id: String,
  principal: [principalSchema],
  general: [generalSchema],
  especifico: [especificoSchema]
});

var ProductSchema2 = Schema({
  //principal
  nombre: String,
  descripcion: String,
  categoria: String,
  precio: Number,
  stock: Number,
  imagen: String,
  //general
  color: String,
  ram: Number,
  rom: Number,
  pantalla: Number,
  resolucion: String,
  bateria: Number,
  camaraf: String,
  camarap: String,
  marca: String,
  //especifico
  modeloproducto: String,
  tipopantalla: String,
  tipoentrada: String,
  sistemaoperativo: String,
  procesador: String,
  peso: Number,
    //medidas
    alto: Number,
    ancho: Number,
    profundidad: Number
});

module.exports = mongoose.model('Producto', ProductSchema2);