const router = require('express').Router();
const axios = require('axios');

const {Types,Pokemon,pokemontypes} = require('../db');
//#########################################################
//Consulta y ordena los nombres de pokemons alfabeticamente
//#########################################################
router.get('/name/:limit/:index', async function(req, res) {

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
  
          var index = req.params.index*1;
       
        try {
              /* Consulta el total de pokemons de la API para determinar cantidad de 
              botones a renderizar para el paginado */
              const { data } = await axios.get( 
              /* `https://pokeapi.co/api/v2/pokemon?limit=840&offset=${req.params.index}.`); */
              `https://pokeapi.co/api/v2/pokemon?limit=840&offset=0.`)
          
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
  
                      arrayDB.push(objDB)
                      data.results.push(objDB)
  
                      objDB = {}
                      arrayTypes = [];
                  });
  
                  arrayDB.forEach(element=>{
                      console.log('El resultado construido es')
                      console.log(element)
                  })
  
              })


              //ordena la lista de pokemons por nombre
              data.results= data.results.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
              });
  
              if(data.results.length-index<12){
                    max = data.results.length-index
              }else{
                    max = index + 12
              }
  
              console.log('va a iterar de ',index,' a ',max)

             

              for(var i = index; i<max;i++){
                console.log(i)
                  if(data.results[i].url){
                        console.log('entra a la url')
                        let  data_aux = axios.get(`${data.results[i].url}`);
                        propPokemon.push(data_aux);
                  }else if(data.results[i].id){
                        resultSet.results.push(data.results[i])
                  }
              }
                  
              /* Ejecuta en paralelo todas las promesas almacenadas en el paso anterior */
              await axios.all(propPokemon)
              .then(axios.spread((...responses)=>{
                  
                  responses.forEach(value=>{
                      properties.push(value.data);
                  })
          
              }))
              .catch(errors=>{console.log(errors) })

              var j = 0;
  
              /* Agrega las caracteristicas de los pokemons */
              for(var i = 0; i<data.results.length;i++){

                    for(var j = 0; j<properties.length;j++){

                        if(data.results[i].name === properties[j].species.name 
                            && data.results[i].url){
                            
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
                }

                resultSet.results= resultSet.results.sort(function (a, b) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                });
  
                console.log('el resultado es,',resultSet)
                res.json(resultSet)
          
        } catch (err) {
              res.json(err)
              console.log(err);
        }
  
});

//################################################
//Consulta y ordena a los pokemons según su ataque
//################################################

router.get('/attack/:index', async function(req, res) {

    var propPokemon=[];
    var globalData;
    var orderAtack=[];
    var pokemons = [];
    var properties = [];
    var dataResult={results:[]};

    try {
     
        const { data } = await axios.get( 
        `https://pokeapi.co/api/v2/pokemon?limit=840&offset=0.`
            
        );

        globalData = data;
        
        
/*         for(var i = 48; i<data.results.length;i++){
            pokemons.push(data.results[i])
        } */

        if(req.params.index<49){
        
            for(var i = 0; i<48;i++){
                let  data = axios.get(`${globalData.results[i].url}`);
                propPokemon.push(data);
                dataResult.results.push(globalData.results[i]);
                /* orderAtack.push(globalData.results[i]) */
            }

        }else{

            //Transforma de string a numero
            req.params.index = req.params.index*1;

            if (req.params.index>0){
                req.params.index = req.params.index-1 ;
            }

            if(data.results.length-req.params.index<12){
                max = data.results.length;
            }else{
                max = req.params.index + 12;
            }

            //Almacena promesas para consulta de propiedades de los pokemons
            console.log('el index va de ',req.params.index,'hasta',max)
            for(var i = req.params.index; i<max;i++){
            let  data = axios.get(`${globalData.results[i].url}`);
            propPokemon.push(data);

            dataResult.results.push(globalData.results[i])
            console.log(globalData.results[i].name)
            }

        }

        /* Ejecuta en paralelo todas las promesas almacenadas en el paso anterior */
        await axios.all(propPokemon)
        .then(axios.spread((...responses)=>{
            
            responses.forEach(value=>{
                properties.push(value.data);
            })
    
        }))
        .catch(errors=>{console.log(errors) })

        if(req.params.index<48){
            max = 48;
        }else{
            
            if(data.results.length-req.params.index<12){
                max = data.results.length-req.params.index;
            }else{
                max = 12;
            }

        }

         /* Agrega las caracteristicas de los pokemons */
         console.log('la carga de propiedades va de 0 ', max)
        for(var i = 0; i<max;i++){

            if(dataResult.results[i].name === properties[i].species.name ){
    
                dataResult.results[i].id = properties[i].id;
                dataResult.results[i].hp = properties[i].stats[0].base_stat;
                dataResult.results[i].attack = properties[i].stats[1].base_stat;
                dataResult.results[i].defense = properties[i].stats[2].base_stat;
                dataResult.results[i].specialAttack = properties[i].stats[3].base_stat;
                dataResult.results[i].specialDefense = properties[i].stats[4].base_stat;
                dataResult.results[i].speed = properties[i].stats[5].base_stat;
                dataResult.results[i].height = properties[i].height;
                dataResult.results[i].weight = properties[i].weight;
                dataResult.results[i].types = [];

                properties[i].types.forEach(value=>{
                    dataResult.results[i].types.push(value.type.name)
                })

                dataResult.results[i].urlImage = properties[i].sprites.front_default;

            }

        }

        if(req.params.index < 49){

            dataResult.results = dataResult.results.sort(function (a, b) {
                if (a.attack > b.attack) {
                  return -1;
                }
                if (a.attack < b.attack) {
                  return 1;
                }
                return 0;
              });

        }
    
        /* console.log('las propiedades tienen ',properties.length) */
        
          res.json(dataResult)
        
        } catch (err) {
            res.json(err)
            console.log(err);
        }

})

module.exports = router;