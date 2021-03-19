const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('movies', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true
    },

    title: {
        type: DataTypes.STRING, 
    },

    year:{
        type: DataTypes.INTEGER,
    },

    rate:{
        type: DataTypes.DECIMAL,
    },

    urlposter:{
        type: DataTypes.STRING
    },

    description:{
        type: DataTypes.STRING
    }

    
  });

};
