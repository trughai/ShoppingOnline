require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const ProductDAO = {
  // --- CÁC HÀM CƠ BẢN (CRUD) ---

  // 1. Lấy tất cả sản phẩm
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // 2. Tìm sản phẩm theo ID
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  // 3. Tìm sản phẩm theo Category ID
  async selectByCatID(_cid) {
    const query = { 'category._id': _cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // 4. Tìm kiếm sản phẩm theo từ khóa (Hàm mới thêm)
  async selectByKeyword(keyword) {
    // Sử dụng RegExp với flag "i" để tìm kiếm không phân biệt hoa thường
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // 5. Thêm sản phẩm mới
  async insert(product) {
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  // 6. Cập nhật sản phẩm
  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    };
    const result = await Models.Product.findByIdAndUpdate(product._id, newvalues, { new: true });
    return result;
  },

  // 7. Xóa sản phẩm
  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id).exec();
    return result;
  },

  // --- CÁC HÀM THỐNG KÊ / NÂNG CAO ---

  // 8. Lấy danh sách sản phẩm mới nhất (Top New)
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // Sắp xếp giảm dần theo ngày tạo
    const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
    return products;
  },

  // 9. Lấy danh sách sản phẩm bán chạy nhất (Top Hot)
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } }, 
      { $unwind: '$items' },
      { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
      { $sort: { sum: -1 } }, 
      { $limit: top }
    ]).exec();

    var products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      if (product) { 
          products.push(product);
      }
    }
    return products;
  }
};

module.exports = ProductDAO;