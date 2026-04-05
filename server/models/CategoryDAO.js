require('../utils/MongooseUtil');
const Models = require('./Models');

const CategoryDAO = {
  async selectAll() {
    const query = {};
    const categories = await Models.Category.find(query).exec();
    return categories;
  },
  async selectByID(_id) {
    const category = await Models.Category.findById(_id).exec();
    return category;
  }
};
module.exports = CategoryDAO;