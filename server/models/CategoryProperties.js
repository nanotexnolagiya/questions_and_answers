module.exports = (sequelize, DataTypes) => {
  const CategoryProperties = sequelize.define(
    'CategoryProperties',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      categoryId: DataTypes.INTEGER,
      propertyId: DataTypes.INTEGER
    },
    {}
  )
  CategoryProperties.associate = function(models) {
    // associations can be defined here
  }
  return CategoryProperties
}
