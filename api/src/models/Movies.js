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

    duration:{
      type: DataTypes.STRING, 
    },

    backgroundimage:{
      type: DataTypes.STRING(1234), 
    },

    trailer:{
      type: DataTypes.STRING,
    },

    year:{
        type: DataTypes.INTEGER,
    },

    rating:{
        type: DataTypes.STRING,
    },

    urlposter:{
        type: DataTypes.STRING(1234)  
    },

    description:{
        type: DataTypes.STRING(1234)  
    },

    category1:{
      type: DataTypes.STRING
    },

    category2:{
      type: DataTypes.STRING
    },

    category3:{
      type: DataTypes.STRING
    },

    
  });

};
