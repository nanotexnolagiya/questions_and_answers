module.exports = (sequelize, DataTypes) => {
  const ApplicationReceive = sequelize.define(
    'ApplicationReceive',
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
  ApplicationReceive.associate = function(models) {
    models.ApplicationReceive.belongsTo(models.Categories, {
      foreignKey: 'categoryId',
      targetKey: 'id'
    })

    models.ApplicationReceive.belongsTo(models.Statuses, {
      foreignKey: 'statusId',
      targetKey: 'id'
    })

    models.ApplicationReceive.belongsTo(models.Users, {
      as: "ApplicationReceiveUser",
      foreignKey: 'userId',
      targetKey: 'id'
    })

    models.ApplicationReceive.belongsTo(models.Users, {
      as: "ApplicationReceiveSupplier",
      foreignKey: 'supplierId',
      targetKey: 'id'
    })

    models.ApplicationReceive.belongsTo(models.Things, {
      foreignKey: 'thingId',
      targetKey: 'id'
    })

    models.ApplicationReceive.belongsToMany(models.Properties, {
      through: models.ApplicationReceivePropertyValues,
      foreignKey: 'applicationReceiveId'
    })
  }
  return ApplicationReceive
}
