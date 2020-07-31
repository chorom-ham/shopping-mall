import React, { useState, useEffect } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import ImageSlider from "../../utils/ImageSlider";

const { Meta } = Card;

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(4);
  const [postSize, setPostSize] = useState();

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

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>
      {/* Filter  */}
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
