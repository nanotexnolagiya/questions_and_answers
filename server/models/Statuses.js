module.exports = (sequelize, DataTypes) => {
  const Statuses = sequelize.define(
    'Statuses',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      code: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true
      },
      name: DataTypes.STRING
    },
    {}
  )
  Statuses.associate = function(models) {}
  return Statuses
}
