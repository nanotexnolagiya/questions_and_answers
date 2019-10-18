module.exports = (sequelize, DataTypes) => {
  const Things = sequelize.define(
    'Things',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER
    },
    {}
  )
  Things.associate = function(models) {
    models.Things.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      targetKey: 'id'
    })

    models.Things.belongsTo(models.Statuses, {
      foreignKey: 'statusId',
      targetKey: 'id'
    })

    models.Things.belongsToMany(models.Properties, {
      through: models.ThingPropertyValues,
      foreignKey: 'thingId'
    })
  }
  return Things
}
