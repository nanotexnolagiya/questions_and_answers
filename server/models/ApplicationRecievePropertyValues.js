module.exports = (sequelize, DataTypes) => {
  const ApplicationRecievePropertyValues = sequelize.define(
    'ApplicationRecievePropertyValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      value: DataTypes.STRING,
      propertyId: DataTypes.INTEGER,
      applicationRecieveId: DataTypes.INTEGER
    },
    {}
  )
  ApplicationRecievePropertyValues.associate = function(models) {
    // associations can be defined here
  }
  return ApplicationRecievePropertyValues
}
