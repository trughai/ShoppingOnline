const express = require('express');
const router = express.Router();

// Utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil'); // Thêm EmailUtil

// DAOs
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

// --- LOGIN & TOKEN ---

// (POST) http://localhost:3000/api/admin/login
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(admin.username, admin.password);
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

// (GET) http://localhost:3000/api/admin/token
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// --- CATEGORY MANAGEMENT ---

// (GET) http://localhost:3000/api/admin/categories
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// --- PRODUCT MANAGEMENT ---

// (GET) http://localhost:3000/api/admin/products?page=xxx
// Lấy danh sách sản phẩm
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  var products = await ProductDAO.selectAll();
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

// (POST) http://localhost:3000/api/admin/products
// Thêm sản phẩm mới
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();
  const category = await CategoryDAO.selectByID(cid);
  const product = { name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

// (PUT) http://localhost:3000/api/admin/products
// Cập nhật sản phẩm
router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id; 
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); 
  
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
  
  const result = await ProductDAO.update(product);
  res.json(result);
});

// (DELETE) http://localhost:3000/api/admin/products/:id
// Xóa sản phẩm
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id; // Lấy ID từ tham số URL
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// --- CUSTOMER MANAGEMENT ---

// (GET) http://localhost:3000/api/admin/customers
// Lấy danh sách khách hàng
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// (PUT) http://localhost:3000/api/admin/customers/deactive/:id
// Hủy kích hoạt tài khoản khách hàng
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

// (GET) http://localhost:3000/api/admin/customers/sendmail/:id
// Gửi email kích hoạt cho khách hàng
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// --- ORDER MANAGEMENT ---

// (GET) http://localhost:3000/api/admin/orders
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

// (GET) http://localhost:3000/api/admin/orders/customer/:cid
// Lấy danh sách đơn hàng theo ID khách hàng
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// (PUT) http://localhost:3000/api/admin/orders/status/:id
// Cập nhật trạng thái đơn hàng
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

module.exports = router;