module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    'Categories',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: DataTypes.STRING,
      parentId: DataTypes.INTEGER
    },
    {}
  )
  Categories.associate = function(models) {
    models.Categories.belongsToMany(models.Properties, {
      through: models.CategoryProperties,
      foreignKey: 'categoryId'
    })

    models.Categories.hasMany(models.Things, {
      foreignKey: 'categoryId',
      sourceKey: 'id'
    })
  }
  return Categories
}
