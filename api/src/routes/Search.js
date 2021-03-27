const router = require('express').Router();
const axios = require('axios');

const {Types,Pokemon,pokemontypes} = require('../db');

router.get('/:name', async function(req, res) {

    console.log('se ejecuta, ',req.params.name)

    var arrayTypes = [];
    var arrayDB = [];
    var objDB = {};

    req.params.name = req.params.name.toLowerCase();


    try {
        
        //Consulta los pokemons almacenados en la base de datos

        await Pokemon.findAll({ where: {name : req.params.name},
                                include: {model:Types}
                              })
        .then(datosTabla =>{ 

           /*  console.log('EL resultado de datosTabla es:',datosTabla ) */
            
            /* console.log('Los DATOS DE LA BUSQUEDA SON') */
            datosTabla.forEach(element => {

                /* console.log(element.dataValues.types[0].dataValues.name) */
              /*   console.log('los tipos de este pokemon son')*/
                element.dataValues.types.forEach(value=>{
                    console.log('encontró, ')
                    console.log(value.dataValues.name)
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

                arrayDB.push(objDB)

                objDB = {}
                arrayTypes = [];
            });

            /* console.log('el resultado ES, ',arrayDB) */

           /*  arrayDB.forEach(element=>{
                console.log('El resultado construido es')
                console.log(element)
            }) */

           /*  console.log('la longitud del array es,',arrayDB.length ) */

        })
        .catch(err=>{
            console.log(err)
        })

        if(!arrayDB.length){

            const { data } = await axios.get( 
            `https://pokeapi.co/api/v2/pokemon/${req.params.name}`
            )  

            /* console.log(data) */

            var result = {};

            result.name = data.species.name;
            result.id = data.id;
            result.types = [];
            result.hp = data.stats[0].base_stat;
            result.attack =data.stats[1].base_stat;
            result.defense =data.stats[2].base_stat;
            result.speed =data.stats[5].base_stat;
            result.height =data.height;
            result.weight =data.weight;

            data.types.forEach(value=>{
                result.types.push(value.type.name)
            })

            result.urlImage = data.sprites.front_default;
        
            res.json(result)

        }else{
            console.log('Enviará el ARRAY DB')
            res.json(arrayDB);
        }

    } catch (err) {
        res.json(err)
        console.log(err);
    }

});

module.exports = router;