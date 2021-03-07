const router = require('express').Router();
const axios = require('axios');

router.get('/', async function(req, res) {

    try{

        const { data } = await axios.get(
            `https://yts.am/api/v2/movie_suggestions.json?movie_id=10`
          ); 

          res.json(data.data.movies)

    }
    catch(err){
        res.json(err)
        console.log(err)
    }

    


})


module.exports = router;