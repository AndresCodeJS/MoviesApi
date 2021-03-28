const router = require('express').Router();
const axios = require('axios');

const {Types,Pokemon,pokemontypes} = require('../db');

router.get('/', async function(req, res) {

        var arrayTypes = [];
        var arrayDB = [];
        var objDB = {};

        //Consulta los pokemons almacenados en la base de datos

        await Pokemon.findAll({ include: {model:Types} })
        .then(datosTabla =>{ 

                /* console.log('EL resultado de datosTabla es:',datosTabla ) */

                /* console.log('Los DATOS DE LA BUSQUEDA SON') */
                datosTabla.forEach(element => {

                /* console.log(element.dataValues.types[0].dataValues.name) */
                /*   console.log('los tipos de este pokemon son')*/
                element.dataValues.types.forEach(value=>{
                /* console.log('encontró, ')
                console.log(value.dataValues.name) */
                arrayTypes.push(value.dataValues.name)
                }) 

                objDB.id = element.dataValues.id;
                objDB.name = element.dataValues.name
                objDB.hp = element.dataValues.hp
                objDB.attack = element.dataValues.attack
                objDB.defense = element.dataValues.defense
                objDB.speed = element.dataValues.speed
                objDB.height = element.dataValues.height
                objDB.weight = element.dataValues.weight
                objDB.types = arrayTypes
                objDB.urlImage = element.dataValues.urlImage

                arrayDB.push(objDB)

                objDB = {}
                arrayTypes = [];
                });

                res.json(arrayDB)

        })
        .catch(err=>{
            console.log(err)
            res.json(err)
        })  

        

})

module.exports = router;