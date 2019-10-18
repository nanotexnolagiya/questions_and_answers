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
      name: DataTypes.STRING,
      type: DataTypes.STRING
    },
    {
      scopes: {
        publicProperties: {
          include: [
            { model: sequelize.models.Categories }
          ]
        }
      }
    }
  )
  Properties.associate = function(models) {
    models.Properties.belongsToMany(models.Categories, {
      through: models.CategoryProperties,
      foreignKey: 'propertyId'
    })
    models.Properties.belongsToMany(models.Things, {
      through: models.ThingPropertyValues,
      foreignKey: 'propertyId'
    })
  }
  return Properties
}
