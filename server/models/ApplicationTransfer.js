module.exports = (sequelize, DataTypes) => {
  const ApplicationTransfer = sequelize.define(
    'ApplicationTransfer',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      text: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      supplierId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER
    },
    {}
  )
  ApplicationTransfer.associate = function(models) {
    models.ApplicationTransfer.belongsTo(models.Users, {
      foreignKey: 'user_id',
      targetKey: 'id'
    })

    models.ApplicationTransfer.belongsTo(models.Users, {
      foreignKey: 'supplier_id',
      targetKey: 'id'
    })

    models.ApplicationTransfer.belongsTo(models.Statuses, {
      foreignKey: 'status_id',
      targetKey: 'id'
    })

    models.ApplicationTransfer.belongsToMany(models.Uploads, {
      through: models.ApplicationTransferUploads,
      foreignKey: 'applicationTransfer_id'
    })
  }
  return ApplicationTransfer
}
