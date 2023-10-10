//Librerias externas
const express = require('express');
const fs = require('fs');
const Joi = require('joi');
const {v4: uuidv4} = require('uuid');
const { registrerShema    } =require('./shemas/registrer'); 
const validation = require('./middleware/joiValidation'); // Utiliza el mismo nombre que en el export

 //Modulos internas
 const { readFile, writeFile } = require('./src/files');

 const app = express();
 const FILE_NAME = './db/deportes.txt';

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//   // Realiza la validación de los datos utilizando Joi
//   const { error } = validarDatos(req.body); // Llama a la función de validación
//   app.post('/validardatos', (req, res) => {
//     const { error } = validarDatos(req.body); // Acceso a req en el contexto de una solicitud HTTP
//     // Resto del código de la ruta
//   });

//   if (error) {
//     res.status(400).json({ error: error.details[0].message });
//   } else {
//     // Procede con la creación de los datos en tu aplicación
//     // ...
//     res.json({ mensaje: 'Datos creados con éxito' });
//   }


//Rutas
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    res.send(`Hello ${formal ? 'Mr.' : ''} 
    ${name} ${type ? ' ' + type : ''}`);
});

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

//API
//Listar deportes
app.get('/deportes', (req,res) =>{
    const data = readFile(FILE_NAME);
    res.json(data);
})

//Crear deportes
app.post('/deportes',validation (registrerShema) ,(req, res) => {
    try{
    //Leer el archivo de deportes
    const data = readFile(FILE_NAME);

    //Agregar 
    const newDeporte = req.body;
    newDeporte.id = uuidv4();
    console.log(newDeporte)
    data.push(newDeporte); //agrego nuevo elemento
    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'el deporte fue creado'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar el deporte'});
    }

});

//Obtener un solo deporte  (usamos los dos puntos por que es un path param)
app.put('/deportes/:id', (req, res) =>{
    console.log(req.params.id);

// guardar id 
const id= req.params.id
// lleer el contenido del artchico 
const deportes =readFile(FILE_NAME)
// BUSCAR EL DEPORTE CON EL ID QUE RECIMIBOS EN PARAM 
    const deporteFound =deportes.find (deporte =>deporte.id===id )
    if (!deporteFound){
        res.status(404).json({ 'OK':false, message:"sport not found "
        })
        return;
    }
res.json({'ok':true , deporte:deporteFound});
})

// Actualizar un deporte
app.put('/deportes/:id', (req, res) => {
    const id = req.params.id;
    const deportes = readFile(FILE_NAME);

    const deporteIndex = deportes.findIndex(deporte => deporte.id === id);

    if (deporteIndex < 0) {
        res.status(404).json({ 'ok': false, message: "sport not found" });
        return;
    }

    let deporte = deportes[deporteIndex];
    deporte = { ...deporte, ...req.body };
    deportes[deporteIndex] = deporte;

    writeFile(FILE_NAME, deportes);

    res.json({ 'ok': true, deporte: deporte });
});

// Eliminar un deporte
app.delete('/deportes/:id', (req, res) => {
    const id = req.params.id;
    const deportes = readFile(FILE_NAME);

    const deporteIndex = deportes.findIndex(deporte => deporte.id === id);

    if (deporteIndex < 0) {
        res.status(404).json({ 'ok': false, message: "sport not found" });
        return;
    }

    deportes.splice(deporteIndex, 1);
    writeFile(FILE_NAME, deportes);

    res.json({ 'ok': true });
});


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
});
