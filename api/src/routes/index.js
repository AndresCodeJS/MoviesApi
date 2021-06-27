const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Pokemons = require('./Pokemons');
const Order = require('./Order');
const DetailPokemon = require('./DetailPokemon')
const Types = require('./Types')
const Search = require('./Search')
const AllTypes = require('./AllTypes')
const CreatePokemon = require('./CreatePokemon')
const MyPokemons = require('./MyPokemons')
const MovieSuggestion = require('./MovieSuggestion')
const Movies = require('./Movies')
const Delete = require('./DeletePokemon')
const RefreshServer = require('./RefreshServer')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons',Pokemons);
router.use('/pokemons/order',Order);
router.use('/detail',DetailPokemon);
router.use('/types',Types);
router.use('/search',Search);
router.use('/alltype',AllTypes);
router.use('/create',CreatePokemon);
router.use('/mypokemons',MyPokemons);
router.use('/suggestion',MovieSuggestion);
router.use('/movies',Movies);
router.use('/delete',Delete);
router.use('/refresh',RefreshServer);
module.exports = router;
