'use strict';
module.exports = (sequelize, DataTypes) => {
  var form_structure = sequelize.define('form_structures', {
    record_id: DataTypes.STRING,
    dsc: DataTypes.STRING,
    data: DataTypes.STRING
  }, {
    schema:"jsf"
  });
  form_structure.associate = function(models) {
    // associations can be defined here
  };
  return form_structure;
};