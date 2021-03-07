const router = require('express').Router();
const axios = require('axios');

const {Types,Pokemon,pokemontypes} = require('../db');

router.post('/', async function(req, res) {

    console.log('se ejecuta el Create con,' ,req.body)

    var resultFind = [];
    var id=0;

    Pokemon.findAll()
    .then(datosTabla =>{ 
        datosTabla.forEach(element => {
                            resultFind.push(element.dataValues.id)
        })
     })
    .then(()=>{

        if(resultFind.length){
            resultFind= resultFind.sort(function (a, b) {
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            console.log(resultFind)
            id = resultFind[resultFind.length-1]+1
        }else{
            id = 2000;
            console.log('id es:',id)
        }

        if (!req.body.hp){
            req.body.hp = req.body.hp*1;
        }
        if (!req.body.attack){
            req.body.attack = req.body.attack*1;
        }
        if (!req.body.defense){
            req.body.defense = req.body.defense*1;
        }
        if (!req.body.speed){
            req.body.speed = req.body.speed*1;
        }
        if (!req.body.height){
            req.body.height = req.body.height*1;
        }
        if (!req.body.weight){
            req.body.weight = req.body.weight*1;
        }
                   
        Pokemon.create({
            id:id,
            name: req.body.name,
            hp:req.body.hp,
            attack:req.body.attack,
            defense:req.body.defense,
            speed:req.body.speed,
            height:req.body.height,
            weight:req.body.weight,
        })
        .then((reponse)=>{

            var arrayTypes = [];

            arrayTypes.push(req.body.types1);
            arrayTypes.push(req.body.types2);
            arrayTypes.push(req.body.types3);

            arrayTypes.forEach(value=>{
                if(value && value.id){
                    console.log('se crearan en la tabla de asociaciones,',value.id,value.name)
                    pokemontypes.create({
                        pokemonId:id,
                        typeId:value.id
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }
            })
          
            console.log('ok')
            res.json('success')
        })
        .catch((err)=>{
            console.log(err)
            res.json('failed')
         })
    
     })
     .catch((err)=>{
        console.log(err)
        res.json(err)
     })

});

module.exports = router;