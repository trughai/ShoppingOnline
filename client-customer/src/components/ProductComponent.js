import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
            <Link to={'/product/' + item._id}>
              <img
                src={"data:image/jpg;base64," + item.image}
                width="300px"
                height="300px"
                alt=""
              />
            </Link>
            <figcaption className="text-center">
              {item.name}<br />
              Price: {item.price}
            </figcaption>
          </figure>
        </div>
      );
    });

    return (
      <div className="text-center">
        <h2 className="text-center">LIST PRODUCTS</h2>
        {prods}
      </div>
    );
  }

  componentDidMount() { // first load
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) { // changes
    const params = this.props.params;

    // 1. Trường hợp thay đổi Category ID
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } 
    // 2. Trường hợp thay đổi Keyword tìm kiếm
    else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // --- APIS ---

  // Lấy sản phẩm theo danh mục
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }

  // Lấy sản phẩm theo từ khóa (Search)
  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
}

export default withRouter(Product);
