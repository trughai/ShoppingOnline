import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: '' // State lưu từ khóa tìm kiếm
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <li key={item._id} className="menu">
          <Link to={'/product/category/' + item._id}>{item.name}</Link>
        </li>
      );
    });

    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            <li className="menu">
              <Link to="/">Home</Link>
            </li>
            {cates}
          </ul>
        </div>

        <div className="float-right">
          {/* Thêm sự kiện onSubmit để xử lý khi nhấn Enter hoặc nút Search */}
          <form className="search" onSubmit={(e) => this.btnSearchClick(e)}>
            <input
              type="search"
              placeholder="Enter keyword"
              className="keyword"
              value={this.state.txtKeyword}
              onChange={(e) => { this.setState({ txtKeyword: e.target.value }) }}
            />
            <input
              type="submit"
              value="SEARCH"
            // Không cần onClick ở đây nữa vì đã có onSubmit ở thẻ form
            />
          </form>
        </div>

        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // event-handlers
  btnSearchClick(e) {
    e.preventDefault(); // Ngăn chặn trang reload
    if (this.state.txtKeyword.trim().length > 0) {
        this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
  }

  // apis
  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}

export default withRouter(Menu);