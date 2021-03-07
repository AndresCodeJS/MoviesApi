const router = require('express').Router();
const axios = require('axios');

router.get('/', async function(req, res) {

    try{

        const { data } = await axios.get(
            `https://yts.mx/api/v2/list_movies.json?limit=15`
          ); 

          console.log('La lista de peliculas es', data)

          res.json(data.data.movies)


    }
    catch(err){
        res.json(err)
        console.log(err)
    }

    


})


module.exports = router;