import React, { useEffect } from "react";
import { FaCode } from "react-icons/fa";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.post("/api/product/products").then((res) => {
      if (res.data.success) {
        console.log(res.data);
      } else {
        alert("상품 목록을 가져오는 데 실패했습니다.");
      }
    });
  });
  return <div></div>;
}

export default LandingPage;
