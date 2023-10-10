const Joi = require('joi');

module.exports = {registrerShema:Joi.object({
   

// Definir el esquema de validación para un arreglo de deportes

  // id: Joi.string().guid().required(),   
  code: Joi.string().min(3).max(20).required(),   
  name: Joi.string().min(3).max(50).required(),
  descripcion: Joi.string().min(10).max(200).required(),
  'numero canchas': Joi.number().integer().min(0).max(100).required(),
  'cantidad equipos': Joi.number().integer().min(0).max(50).required(),
})}