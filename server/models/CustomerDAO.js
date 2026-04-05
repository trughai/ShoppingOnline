require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose'); // Đưa lên đầu để dùng chung

const CustomerDAO = {
  // Thêm method selectAll theo yêu cầu
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },

  // Thêm method selectByID theo yêu cầu
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username }, { email }] }; // Rút gọn key-value giống nhau
    return await Models.Customer.findOne(query); // Trả về trực tiếp
  },

  async insert(customer) {
    customer._id = new mongoose.Types.ObjectId();
    return await Models.Customer.create(customer); // Trả về trực tiếp result
  },

  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
    return result;
  },

  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  async update(customer) {
    const newvalues = { 
      username: customer.username, 
      password: customer.password, 
      name: customer.name, 
      phone: customer.phone, 
      email: customer.email 
    };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  }
};

module.exports = CustomerDAO;