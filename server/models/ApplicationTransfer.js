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
    {
      scopes: {
        // publicAppTrans: {
        //   include: [
        //     { model: sequelize.models.Uploads },
        //     { model: sequelize.models.Users },
        //     { model: sequelize.models.Statuses }
        //   ]
        // },
        // sequelize
      }
    }
  )
  ApplicationTransfer.associate = function(models) {
    models.ApplicationTransfer.belongsTo(models.Users, {
      as: 'ApplicationTransferUser',
      foreignKey: 'userId',
      targetKey: 'id'
    })

    models.ApplicationTransfer.belongsTo(models.Users, {
      as: 'ApplicationTransferSupplier',
      foreignKey: 'supplierId',
      targetKey: 'id'
    })

    models.ApplicationTransfer.belongsTo(models.Statuses, {
      foreignKey: 'statusId',
      targetKey: 'id'
    })

    models.ApplicationTransfer.belongsToMany(models.Uploads, {
      through: models.ApplicationTransferUploads,
      foreignKey: 'applicationTransferId'
    })
  }
  return ApplicationTransfer
}
