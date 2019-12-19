module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    'Questions',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      answer: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      answered_user_id: DataTypes.INTEGER
    },
    {
      freezeTableName: true,
      tableName: "questions"
    }
  );

  Questions.associate = function(models) {
    models.Questions.belongsTo(models.Categories, {
      as: 'category',
      foreignKey: 'category_id',
      targetKey: 'id'
    });

    models.Questions.belongsTo(models.Users, {
      as: "user",
      foreignKey: 'user_id',
      targetKey: 'id'
    });

    models.Questions.belongsTo(models.Users, {
      as: "answered_user",
      foreignKey: 'answered_user_id',
      targetKey: 'id'
    });
  };

  return Questions;
}
