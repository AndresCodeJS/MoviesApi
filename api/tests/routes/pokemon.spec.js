/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, conn } = require('../../src/db.js');

const agent = session(app);
const pokemon = {
  id: 1,
  name: 'blastoise',
};

describe('Pokemon routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Pokemon.sync({ force: true })
    .then(() => Pokemon.create(pokemon)));
  describe('GET /mypokemons', () => {
    it('Debería responder con status 200 cuando se intenta acceder a los pokemons creados', () =>
      agent.get('/mypokemons').expect(200),
    );
  });

  describe('GET /alltype/type', () => {
    it('Debería responder con status 200 cuando se intenta acceder a todos los tipos de pokemons', () =>
      agent.get('/alltype/type').expect(200),
    );

    it('responde con 404 cuando la página no existe', function() {
      return agent.get('/alltype/noexiste')
        .expect(404);
    });
  
  });


  describe('Crea un nuevo pokemon en la base de datos', () => {

    before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
    beforeEach(() => Pokemon.sync({ force: true }));

    it('Crea un nuevo pokemon en la base de datos', function(){
      return agent.post('/create')
        .send({
          id: 7000,
          name: 'pikachu',
        })
        .then(() => {
          return Pokemon.findOne({
            where: {
              name: 'pikachu'
            }
          });
        })
        .then(page => {
          expect(page).to.exist;
        });
    });

  });

  beforeEach(() => Pokemon.sync({ force: true })
    .then(() => Pokemon.create(pokemon)));
  describe('GET /search/:name', () => {
    it('Consigue un pokemons buscado por nombre exacto en la ruta de busqueda', () =>
      agent.get('/search/blastoise').expect(200),
    );
  });

});
