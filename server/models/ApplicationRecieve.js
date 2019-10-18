module.exports = (sequelize, DataTypes) => {
  const ApplicationRecieve = sequelize.define(
    'ApplicationRecieve',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      supplierId: DataTypes.INTEGER,
      thingId: DataTypes.INTEGER
    },
    {}
  )
  ApplicationRecieve.associate = function(models) {
    models.ApplicationRecieve.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Statuses, {
      foreignKey: 'statusId',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Users, {
      foreignKey: 'supplierId',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Things, {
      foreignKey: 'thingId',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsToMany(models.Properties, {
      through: models.ApplicationRecievePropertyValues,
      foreignKey: 'applicationRecieveId'
    })
  }
  return ApplicationRecieve
}
