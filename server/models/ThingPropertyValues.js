module.exports = (sequelize, DataTypes) => {
  const ThingPropertyValues = sequelize.define(
    'ThingPropertyValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      value: DataTypes.STRING,
      propertyValueId: DataTypes.INTEGER,
      thingId: DataTypes.INTEGER
    },
    {}
  )
  ThingPropertyValues.associate = function(models) {
    // associations can be defined here
  }
  return ThingPropertyValues
}
