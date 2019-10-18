module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    'Roles',
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
      name: {
        type: DataTypes.STRING
      }
    },
    {
      scopes: {
        rolePublic: {
          attributes: ['code', 'name'],
        }
      },
    }
  )
  Roles.associate = function(models) {
    // models.Roles.hasMany(models.Users, {
    //   foreignKey: 'roleId'
    // });
  }
  return Roles
}
