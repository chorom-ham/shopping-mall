import React, { useState, useEffect } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import ImageSlider from "../../utils/ImageSlider";

const { Meta } = Card;

function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.post("/api/product/products").then((res) => {
      if (res.data.success) {
        setProducts(res.data.productInfo);
      } else {
        alert("상품 목록을 가져오는 데 실패했습니다.");
      }
    });
  });

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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button>Load More</button>
      </div>
    </div>
  );
}

export default LandingPage;
