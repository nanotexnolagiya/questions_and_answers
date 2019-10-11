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
      foreignKey: 'category_id',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Statuses, {
      foreignKey: 'status_id',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Users, {
      foreignKey: 'user_id',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Users, {
      foreignKey: 'supplier_id',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsTo(models.Things, {
      foreignKey: 'thing_id',
      targetKey: 'id'
    })

    models.ApplicationRecieve.belongsToMany(models.PropertyValues, {
      through: models.ApplicationRecievePropertyValues,
      foreignKey: 'applicationRecieve_id'
    })

    models.ApplicationRecieve.hasMany(models.ApplicationRecievePropertyValues, {
      as: 'getApplicationRecievePropertyValues',
      foreignKey: 'applicationRecieve_id',
      sourceKey: 'id'
    })
  }
  return ApplicationRecieve
}
