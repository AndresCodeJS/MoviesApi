const router = require('express').Router();
const axios = require('axios');

const {Types} = require('../db');

router.get('/type', async function(req, res) {

    var result = [];

    Types.findAll()
     .then(datosTabla =>{ 

        datosTabla.forEach(element => {

            var obj = {id:element.dataValues.id,
                       name:element.dataValues.name}

            result.push(obj)
        });

        /* console.log(result) */

        res.json(result)

     })
     .catch((err)=>{
        res.json(err)
     })

     /* try {

        const { data } = await axios.get( 
        `https://pokeapi.co/api/v2/type`)

        var cont = 1;

        data.results.forEach(element => {
            console.log(element.name);

            if(element.name !== 'unknown' ){

            Types.create({
                id: cont,
                name: element.name,
              })  

              cont ++;

            }


        });

 } catch (err) {
        res.json(err)
        console.log(err);
    }
 */

 });
    

    /*  Types.create({
        id: 1,
        name: 'normal',
      })  */

  


module.exports = router;