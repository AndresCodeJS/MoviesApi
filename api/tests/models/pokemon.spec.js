const { Pokemon,Types, conn } = require('../../src/db.js');
const { expect } = require('chai');


describe('Pokemon model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Pokemon.sync({ force: true }));
    describe('name', () => {
      it('Debería devolver un error si el nombre está vacío', (done) => {
        Pokemon.create({})
          .then(() => done(new Error('Requiere un nombre')))
          .catch(() => done());
      });
      it('should work when its a valid name', () => {
        Pokemon.create({ name: 'Pikachu' });
      });
    });
  });

  beforeEach(() => Pokemon.sync({ force: true }));
  it('Debería devolver un error si el registro no tiene ID', (done) => {
    Pokemon.create({name:'blastoise'})
      .then(() => done(new Error('Requiere un ID')))
      .catch(() => done());
  });

  it('No debería crearse si el ID es un string', (done) => {
    Pokemon.create({name:'pikachu', id:'ss'})
      .then(() => done(new Error('campo ID debe ser de tipo entero')))
      .catch(() => done());
  });

  it('Debería poder crearse el registro si el name y el ID son correctos', (done) => {
    Pokemon.create({name:'reagen', id:1})
    .then(() => done())
  });



});
