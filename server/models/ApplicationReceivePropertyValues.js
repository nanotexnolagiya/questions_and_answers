module.exports = (sequelize, DataTypes) => {
  const ApplicationReceivePropertyValues = sequelize.define(
    'ApplicationReceivePropertyValues',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      value: DataTypes.STRING,
      propertyId: DataTypes.INTEGER,
      applicationReceiveId: DataTypes.INTEGER
    },
    {}
  )
  ApplicationReceivePropertyValues.associate = function(models) {
    // associations can be defined here
  }
  return ApplicationReceivePropertyValues
}
