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
      }
    },
    {
      scopes: {
        rolePublic: {
          attributes: ['code'],
        }
      },
    }
  )
  Roles.associate = function(models) {
    // models.Roles.hasMany(models.Users, {
    //   foreignKey: 'role_id'
    // });
  }
  return Roles
}
