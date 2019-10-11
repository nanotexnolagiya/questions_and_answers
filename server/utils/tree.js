module.exports = input => {
  try {
    const appendChild = (array, item) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].dataValues.id === item.dataValues.parentId) {
          array[i].dataValues.children.push(item);
          break;
        } else if (array[i].dataValues.children)
          appendChild(array[i].dataValues.children, item);
      }
      return array;
    };

    for (let i = 0; i < input.length; i++) {
      input[i].dataValues.children = [];
      if (input[i].dataValues.parentId !== 0) {
        input = appendChild(input, input[i]);
        input.splice(i, 1);
        i--;
      }
    }
    return input;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
