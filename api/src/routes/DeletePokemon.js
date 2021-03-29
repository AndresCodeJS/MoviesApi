const router = require('express').Router();
const axios = require('axios');

const {Pokemon} = require('../db');

router.post('/:id', async function(req, res) {

try{
    const result = await Pokemon.destroy({where:{id:req.params.id}})
    res.json(result)
}catch (err){
    console(err)
    res.json(err)
}

})

module.exports = router;