const router = require('express').Router();
const axios = require('axios');

const {Types,Pokemon,pokemontypes} = require('../db');

router.get('/:id', async function(req, res) {

    console.log('se ejecuta el detalle del Pokemon', req.params.id)

    var resultSet = {results:[]};
    var arrayTypes = [];
    var arrayDB = [];
    var objDB = {};

    try {
        /* Consulta el total de pokemons de la API para determinar cantidad de 
        botones a renderizar para el paginado */


        await Pokemon.findByPk(req.params.id,{ include: {model:Types} })
            .then(datosTabla =>{ 
                console.log('EEEEEEEEEEEE')
                console.log(datosTabla)
                
                    datosTabla.dataValues.types.forEach(value=>{
                        console.log(value.dataValues.name)
                        arrayTypes.push(value.dataValues.name)
                    }) 

                    objDB.id = datosTabla.dataValues.id;
                    objDB.name = datosTabla.dataValues.name
                    objDB.hp = datosTabla.dataValues.hp
                    objDB.attack = datosTabla.dataValues.attack
                    objDB.defense = datosTabla.dataValues.defense
                    objDB.speed = datosTabla.dataValues.speed
                    objDB.height = datosTabla.dataValues.height
                    objDB.weight = datosTabla.dataValues.weight
                    objDB.types = arrayTypes

            }).catch(err=>{
                console.log(err)
            })

            console.log('el objeto resultado es:', objDB)

        if(objDB.id){
            res.json(objDB)
        }else{

            const { data } = await axios.get( 
            `https://pokeapi.co/api/v2/pokemon/${req.params.id}`);

            console.log('el resultado es',data)

            var result = {};

            result.name = data.species.name;
            result.id = data.id;
            result.hp = data.stats[0].base_stat;
            result.attack = data.stats[1].base_stat;
            result.defense = data.stats[2].base_stat;
            result.specialAttack = data.stats[3].base_stat;
            result.specialDefense = data.stats[4].base_stat;
            result.speed = data.stats[5].base_stat;
            result.height = data.height;
            result.weight = data.weight;
            result.types = [];

            data.types.forEach(value=>{
                result.types.push(value.type.name)
            })

            result.urlImage = data.sprites.front_default;
        
            res.json(result)

        }
                
    } catch (err) {
        res.json(err)
        console.log(err);
    }

    




});

module.exports = router;