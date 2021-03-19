const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    hp: {
      type: DataTypes.STRING,
    },

    attack:{
      type: DataTypes.STRING,
    },

    defense:{
      type: DataTypes.STRING,
    },

    speed:{
      type: DataTypes.STRING,
    },

    height:{
      type: DataTypes.STRING,
    },

    weight:{
      type: DataTypes.STRING,
    },

    urlImage:{
      type: DataTypes.STRING,
    }


  });

};
