module.exports = (sequelize, DataTypes) => {
  const PropertyValues = sequelize.define(
    'PropertyValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: DataTypes.STRING,
      propertyId: DataTypes.INTEGER
    },
    {}
  )
  PropertyValues.associate = function(models) {
    models.PropertyValues.belongsTo(models.Properties, {
      foreignKey: 'property_id',
      targetKey: 'id'
    })

    models.PropertyValues.belongsToMany(models.Things, {
      through: models.ThingPropertyValues,
      foreignKey: 'propertyValue_id'
    })

    models.PropertyValues.belongsToMany(models.ApplicationRecieve, {
      through: models.ApplicationRecievePropertyValues,
      foreignKey: 'applicationRecieve_id'
    })
  }
  return PropertyValues
}
