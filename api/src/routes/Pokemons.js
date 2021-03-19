const router = require('express').Router();
const axios = require('axios');
/* const {Pokemon} = require('../../../api/src/models/Pokemon'); */
const {Types,Pokemon,pokemontypes} = require('../db');

router.get('/:limit/:index', async function(req, res) {

       /*  Pokemon.create({
            id: 5,
            name: 'chicorita',
            hp:500
          }) */

        var globalData;
        var propPokemon=[];
        var properties = [];
        var max = 12;
        var resultSet = {results:[]};
        var arrayTypes = [];
        var arrayDB = [];
        var objDB = {};

        if(req.params.index==1){
            req.params.index = 0;
        }

        var index = req.params.index;
     
        try {
            /* Consulta el total de pokemons de la API para determinar cantidad de 
            botones a renderizar para el paginado */
            const { data } = await axios.get( 
            /* `https://pokeapi.co/api/v2/pokemon?limit=840&offset=${req.params.index}.`); */
            `https://pokeapi.co/api/v2/pokemon?limit=840&offset=0.`);
        
            globalData = data;

            //Consulta los pokemons almacenados en la base de datos

            await Pokemon.findAll({ include: {model:Types} })
            .then(datosTabla =>{ 
                
                /* console.log('Los DATOS DE LA BUSQUEDA SON') */
                datosTabla.forEach(element => {

                    /* console.log(element.dataValues.types[0].dataValues.name) */
                  /*   console.log('los tipos de este pokemon son')*/
                    element.dataValues.types.forEach(value=>{
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
                    objDB.urlImage = element.dataValues.urlImage
                    arrayDB.push(objDB)

                    objDB = {}
                    arrayTypes = [];
                });

                arrayDB.forEach(element=>{
                    console.log('El resultado construido es')
                    console.log(element)
                })

            })

            
            /* Del total recorre sólo 12 o los que sobren para extraer la info a mostrar en la primera pagina */
            /* if(data.results.length < 12){
                max = data.results.length;
            } */

            /* console.log('longitud:',arrayDB.length ) */

            var lengthPromises=0;
            var init = 0;

          /*   if(arrayDB.length>12){
                lengthPromises = 0;
            }else{

            } */

            if(index>arrayDB.length){
                index = index - arrayDB.length;
            }

            if(arrayDB.length>12){
               max = 0;
            }else{
               if(index>arrayDB.length){
                   max = index+12
               }else{
                   max = index+12-arrayDB.length;
               }
            } 

            console.log('va a iterar de ',index,' a ',max)
            for(var i = index; i<max;i++){
                let  data = axios.get(`${globalData.results[i].url}`);
                propPokemon.push(data);
            }
                
            /* Ejecuta en paralelo todas las promesas almacenadas en el paso anterior */
            await axios.all(propPokemon)
            .then(axios.spread((...responses)=>{
                
                responses.forEach(value=>{
                    properties.push(value.data);
                })
        
            }))
            .catch(errors=>{console.log(errors) })


            /* Agrega las caracteristicas de los pokemons */
            for(var i = index; i<max;i++){

                var j = i - index;

                if(data.results[i].name === properties[j].species.name ){
                    
                    data.results[i].id = properties[j].id;

                    data.results[i].id = properties[j].id;
                    data.results[i].hp = properties[j].stats[0].base_stat;
                    data.results[i].attack = properties[j].stats[1].base_stat;
                    data.results[i].defense = properties[j].stats[2].base_stat;
                    data.results[i].specialAttack = properties[j].stats[3].base_stat;
                    data.results[i].specialDefense = properties[j].stats[4].base_stat;
                    data.results[i].speed = properties[j].stats[5].base_stat;
                    data.results[i].height = properties[j].height;
                    data.results[i].weight = properties[j].weight;
                    data.results[i].types = [];

                    properties[j].types.forEach(value=>{
                        data.results[i].types.push(value.type.name)
                    })

                    data.results[i].urlImage = properties[j].sprites.front_default;

                    resultSet.results.push(data.results[i])
                }
            }

            arrayDB.forEach(value=>{
                if(index<arrayDB.length){
                    resultSet.results.unshift(value)
                }
                data.results.unshift(value)
            })

            //Se ejecuta cuando es primera vez, ya que necesitamos el total de registros
            //para calcular cant de botones para paginado
            if(index == 0){
                console.log('Envia solo la DATA con index',index )
                res.json(data)
            }else{
                console.log('Envia solo el RESULTSET con index',index )
                res.json(resultSet)
            }
        
        } catch (err) {
            res.json(err)
            console.log(err);
        }

    

});

module.exports = router;