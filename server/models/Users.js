module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      role_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      name: DataTypes.STRING,
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      scopes: {
        userPublic: {
          attributes: ['id', 'name', 'phone'],
          include: [
            { model: sequelize.models.Roles.scope('rolePublic') }
          ]
        }
      },
    }
  )
  Users.associate = function(models) {
    models.Users.belongsTo(models.Roles, {
      foreignKey: 'role_id',
      targetKey: 'id'
    })
  }
  return Users
}
