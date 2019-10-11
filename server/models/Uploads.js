module.exports = (sequelize, DataTypes) => {
  const Uploads = sequelize.define(
    'Uploads',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      path: DataTypes.STRING
    },
    {}
  )
  Uploads.associate = function(models) {
    models.Uploads.belongsToMany(models.ApplicationTransfer, {
      through: models.ApplicationTransferUploads,
      foreignKey: 'upload_id'
    })
  }
  return Uploads
}
