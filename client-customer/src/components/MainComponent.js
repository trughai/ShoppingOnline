import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent'; 
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent'; 
import Myorders from './MyordersComponent'; // Thêm import MyordersComponent

class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        <Menu />
        <Inform />
        <Routes>
          {/* Trang chủ */}
          <Route path='/' element={<Navigate replace to='/home' />} />
          <Route path='/home' element={<Home />} />

          {/* Trang danh sách sản phẩm theo danh mục */}
          <Route path='/product/category/:cid' element={<Product />} />

          {/* Trang tìm kiếm sản phẩm theo từ khóa */}
          <Route path='/product/search/:keyword' element={<Product />} />

          {/* Trang chi tiết sản phẩm */}
          <Route path='/product/:id' element={<ProductDetail />} />

          {/* Trang đăng ký tài khoản */}
          <Route path='/signup' element={<Signup />} />

          {/* Trang kích hoạt tài khoản */}
          <Route path='/active' element={<Active />} />

          {/* Trang đăng nhập */}
          <Route path='/login' element={<Login />} />

          {/* Trang hồ sơ cá nhân */}
          <Route path='/myprofile' element={<Myprofile />} />

          {/* Trang giỏ hàng */}
          <Route path='/mycart' element={<Mycart />} />

          {/* Trang lịch sử đơn hàng */}
          <Route path='/myorders' element={<Myorders />} />
        </Routes>
      </div>
    );
  }
}

export default Main;