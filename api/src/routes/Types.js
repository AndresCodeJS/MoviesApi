const router = require('express').Router();
const axios = require('axios');

const {Types,Pokemon,pokemontypes} = require('../db');

router.get('/:type/:indexSearch/:indexLoaded', async function(req, res) {

    console.log('se ejecuta types solicitando', req.params.type)

    console.log('se ejecutará el axios con index: ',req.params.indexSearch,' y limit: ',req.params.indexLoaded)

    try {
        const { data } = await axios.get( 
        `https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0.`       
    );

        var max = (req.params.indexSearch)*1 + 100;
        var propPokemon = [];
        var properties = [];
        var results = {pokemon:[],
                       indexSearch:0};

        console.log('va a iterar de ,',req.params.indexSearch,'a', max)

       /*  data.results.forEach(value=>{
            value.url = value.url.substring(0, value.url.length - 1);
            console.log(value.url)
        }) */

        for(var i = req.params.indexSearch; i<max;i++){
            var  data_aux='';
            //Se hace ésto ya que la api falla en la url 138
            if(data.results[i].url == 'https://pokeapi.co/api/v2/pokemon/138/'
             ||data.results[i].url == 'https://pokeapi.co/api/v2/pokemon/120/'){
                data_aux = axios.get(`${data.results[i-1].url}`);
            }else{
                data_aux = axios.get(`${data.results[i].url}`);
            }
            
            propPokemon.push(data_aux);
        }

        /* Ejecuta en paralelo todas las promesas almacenadas en el paso anterior */
        await axios.all(propPokemon)
        .then(axios.spread((...responses)=>{
            
            responses.forEach(value=>{
                
                properties.push(value.data);
                
            })
    
        }))
        .catch(errors=>{console.log(errors) })

        if(req.params.indexSearch==0){

        //Se ejecuta la búsqueda a la base de datos por el tipo especificado 
        var arrayTypes = [];
        var arrayDB = [];
        var objDB = {};

            await Types.findAll({ where: {name : req.params.type},
                                        include: {model:Pokemon}        })
                .then(datosTabla =>{ 

                /* console.log('EL resultado de datosTabla es:',datosTabla[0].pokemons ) */

                datosTabla[0].pokemons.forEach(value =>{
                /*  console.log(value.dataValues) */
                    objDB.id = value.dataValues.id;
                    objDB.name = value.dataValues.name
                    objDB.types = [req.params.type]

                    results.pokemon.push(objDB)

                    objDB = {}
                })

                /* console.log('el objeto a pushear es, ', arrayDB) */
            

            })
        }

        console.log('la iteracion va de 0 a ',max)

        for(var i = req.params.indexSearch; i<max;i++){

            var types = [];

            var j = i - req.params.indexSearch;

            properties[j].types.forEach(value=>{
                types.push(value.type.name)
            })

            properties[j].types.forEach(value=>{

                if(value.type.name === req.params.type){

                    if(results.pokemon.length <12){
                        var obj = {};

                        obj.id = properties[j].id;
                        obj.name = properties[j].species.name;
                        obj.urlImage = properties[j].sprites.front_default;
                        obj.types = types;

                        results.pokemon.push(obj);

                        results.indexSearch = properties[j].id;

                    }
     
                }

            })
        }

        /* console.log(results) */

        console.log('la longitud es de ,',results.pokemon.length)

        if(results.pokemon.length <12){
            results.indexSearch = -1;

        }

        res.json(results)

    } catch (err) {
        res.json(err)
        console.log(err);
        console.log('CAE DIRECTO AL CATCH')
    }

 


})

module.exports = router;