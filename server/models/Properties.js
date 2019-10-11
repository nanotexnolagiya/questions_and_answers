module.exports = (sequelize, DataTypes) => {
  const Properties = sequelize.define(
    'Properties',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: DataTypes.STRING
    },
    {}
  )
  Properties.associate = function(models) {
    models.Properties.belongsToMany(models.Categories, {
      through: models.CategoryProperties,
      foreignKey: 'property_id'
    })

    models.Properties.hasMany(models.PropertyValues, {
      foreignKey: 'property_id',
      sourceKey: 'id'
    })
  }
  return Properties
}
