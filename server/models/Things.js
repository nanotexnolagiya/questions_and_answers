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
      foreignKey: 'category_id',
      targetKey: 'id'
    })

    models.Things.belongsTo(models.Statuses, {
      foreignKey: 'status_id',
      targetKey: 'id'
    })

    models.Things.belongsToMany(models.PropertyValues, {
      through: models.ThingPropertyValues,
      foreignKey: 'thing_id'
    })

    models.Things.hasMany(models.ThingPropertyValues, {
      foreignKey: 'thing_id',
      sourceKey: 'id'
    })

    models.Things.hasMany(models.ThingPropertyValues, {
      as: 'getThingPropertyValues',
      foreignKey: 'thing_id',
      sourceKey: 'id'
    })
  }
  return Things
}
