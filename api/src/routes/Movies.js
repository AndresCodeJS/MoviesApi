const router = require('express').Router();
const axios = require('axios');

const { Movies,Videos } = require("../db.js");

router.post('/create', async function(req, res) {

    const body = req.body
    const{title,
        trailer,
        year,
        rating,
        duration,
        description,
        urlposter,
        backgroundimage,
        category1,
        category2,
        category3,
        video} = req.body.payload

    console.log('esta es la peli',body)
    try{

        const newMovie = await Movies.create({
            title,
            trailer,
            year,
            duration,
            rating,
            description,
            urlposter,
            backgroundimage,
            category1,
            category2,
            category3,
        })

        const videoOptions = video.map(element => ({ language:element[Object.keys(element)[1]],
                                                     urlvideo:element[Object.keys(element)[2]]}))

        const movieVideos = await Videos.bulkCreate(videoOptions);

        await newMovie.setVideos(movieVideos.map(i => i.dataValues.id))

          res.json(newMovie)
    }
    catch(err){
        res.json(err)
        console.log(err)
    }

})

router.get('/searchall', async function(req, res) {

    try{
        const MovieList = await Movies.findAll({ include: Videos })

        if(MovieList){
            res.json(MovieList)
        }else{
            res.json('no se encontraron resultados')
        }
    }
    catch(err){
        res.json(err)
        console.log(err)
    }

})

router.get('/detail/:id', async function(req, res) {

    const id = req.params.id

    try{
        const MovieList = await Movies.findByPk(id,{include:Videos})

        if(MovieList){
            res.json(MovieList)
        }else{
            res.json('no se encontraron resultados')
        }
    }
    catch(err){
        res.json(err)
        console.log(err)
    }

})

router.put('/edit/:id', async function(req, res) {

    const id = req.params.id
    const{title,
        trailer,
        year,
        rating,
        duration,
        description,
        urlposter,
        backgroundimage,
        category1,
        category2,
        category3,
        video
    } = req.body.payload

    try{
        await Videos.destroy({ where: { movieId: id }});

        const movieToEdit = await Movies.findByPk(parseInt(id));

        movieToEdit.title = title
        movieToEdit.trailer = trailer
        movieToEdit.year = year
        movieToEdit.rating = rating
        movieToEdit.duration = duration
        movieToEdit.description = description
        movieToEdit.urlposter = urlposter
        movieToEdit.backgroundimage = backgroundimage
        movieToEdit.category1 = category1
        movieToEdit.category2 = category2
        movieToEdit.category3 = category3

        await movieToEdit.save();

        const videoOptions = video.map(element => ({ language:element[Object.keys(element)[1]],
                                                     urlvideo:element[Object.keys(element)[2]]}))

        const movieVideos = await Videos.bulkCreate(videoOptions);

        await movieToEdit.setVideos(movieVideos.map(i => i.dataValues.id))

        res.json({proccess:'success'})
       
    }
    catch(err){
        res.json(err)
        console.log(err)
    }

})

router.put('/delete/:id', async function(req, res) {

    const id = req.params.id

    try{

        await Videos.destroy({ where: { movieId: id }});
        await Movies.destroy({ where: { id : id }});

        res.json({status:'deleted'})
    }
    catch(err){
        res.json(err)
        console.log(err)
    }

})

module.exports = router;