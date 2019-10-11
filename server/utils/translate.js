const searchTranslates = (model, translates, fields) => {
  for (m in model) {
    if (
      m.search("Translates") !== -1 &&
      model[m].length !== 0 &&
      Array.isArray(model[m])
    ) {
      for (modelTranslate of model[m]) {
        for (field of fields) {
          translates[modelTranslate.Language.code] = {};
          translates[modelTranslate.Language.code][field] =
            modelTranslate[field];
        }
      }
      model.dataValues.translates = translates;
    } else if (Array.isArray(model[m]) && model[m].length !== 0) {
      for (recModel of model[m]) {
        searchTranslates(recModel, {}, fields);
      }
    }
  }
  return translates;
};

module.exports = (models, fields) => {
  /**
   * @param {object[]} models - Model objects
   * @param {string[]} fields - Get fields
   */
  if (models && Array.isArray(models) && models.length !== 0) {
    for (model of models) {
      searchTranslates(model, {}, fields);
    }
  }
  return models;
};
