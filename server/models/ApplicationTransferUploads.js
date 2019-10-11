module.exports = (sequelize, DataTypes) => {
  const ApplicationTransferUploads = sequelize.define(
    'ApplicationTransferUploads',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      applicationTransferId: DataTypes.INTEGER,
      uploadId: DataTypes.INTEGER
    },
    {}
  )
  ApplicationTransferUploads.associate = function(models) {
    // associations can be defined here
  }
  return ApplicationTransferUploads
}
