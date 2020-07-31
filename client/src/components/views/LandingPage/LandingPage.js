import React, { useState, useEffect } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import Checkbox from "./Sections/Checkbox";
import Radiobox from "./Sections/Radiobox";
import { continents, price } from "./Sections/Data";

const { Meta } = Card;

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(4);
  const [postSize, setPostSize] = useState();
  const [filters, setFilters] = useState({ continents: [], price: [] });

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((res) => {
      if (res.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...res.data.productInfo]);
        } else {
          setProducts(res.data.productInfo);
        }
        setPostSize(res.data.postSize);
      } else {
        alert("상품 목록을 가져오는 데 실패했습니다.");
      }
    });
  };

  useEffect(() => {
    //using limit and skip to get posts
    let body = { skip: skip, limit: limit };

    getProducts(body);
  }, []);

  const loadMoreHandler = () => {
    let _skip = skip + limit;
    let body = { skip: _skip, limit: limit, loadMore: true };

    getProducts(body);
    setSkip(_skip);
  };

  const renderCards = products.map((product, index) => {
    return (
      //하나의 row: 24
      <Col lg={6} md={8} xs={24} key={index}>
        <Card cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilterResults = (_filters) => {
    let body = { skip: 0, limit: limit, filters: _filters };
    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let arr = [];
    for (let key in data) {
      //key는 가격 배열의 인덱스
      if (data[key]._id === parseInt(value, 10)) {
        arr = data[key].array;
      }
    }
    return arr;
  };

  const handleFilters = (_filters, category) => {
    const newFilters = { ...filters };
    newFilters[category] = _filters;

    if (category === "price") {
      let priceValues = handlePrice(_filters);
      newFilters[category] = priceValues;
    }

    showFilterResults(newFilters);
    setFilters(newFilters);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>
      {/* Filter  */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <Checkbox
            list={continents}
            handleFilters={(Filters) => handleFilters(Filters, "continents")}
          ></Checkbox>
        </Col>
        <Col lg={12} xs={24}>
          <Radiobox
            list={price}
            handleFilters={(Filters) => handleFilters(Filters, "price")}
          ></Radiobox>
        </Col>
      </Row>

      {/* Search  */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />
      <br />
      {postSize >= limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>Load More</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
