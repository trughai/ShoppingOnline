import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Product from './ProductComponent'; // 1. Import component Product
import Order from './OrderComponent'; // <-- Import component Order
import Customer from './CustomerComponent'; // <-- Thêm Import component Customer
import { Routes, Route, Navigate } from 'react-router-dom';

class Main extends Component {
  static contextType = MyContext; // using this.context to access global state
  
  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path='/admin' element={<Navigate replace to='/admin/home' />} />
            <Route path='/admin/home' element={<Home />} />
            {/* 2. Thêm Route cho trang Product */}
            <Route path='/admin/product' element={<Product />} />
            {/* 3. Thêm Route cho trang Order */}
            <Route path='/admin/order' element={<Order />} />
            {/* 4. Thêm Route cho trang Customer */}
            <Route path='/admin/customer' element={<Customer />} />
          </Routes>
        </div>
      );
    }
    return (<div />);
  }
}

export default Main;