import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;
const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadProductPage(props) {
  const [TitleValue, setTitleValue] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);
  const [Images, setImages] = useState([]);

  const titleChangeHandler = (e) => {
    setTitleValue(e.currentTarget.value);
  };

  const descriptionChangeHandler = (e) => {
    setDescription(e.currentTarget.value);
  };

  const priceChangeHandler = (e) => {
    setPrice(e.currentTarget.value);
  };

  const continentChangeHandler = (e) => {
    setContinent(e.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!TitleValue || !Description || !Price || !Continent || !Images) {
      return alert("fill all the fields first!");
    }
    //서버에 폼 fill한 값 request로 전송하기
    const body = {
      writer: props.user.userData._id,
      title: TitleValue,
      description: Description,
      price: Price,
      images: Images,
      continents: Continent,
    };
    //백엔드에서 처리후 then이하 실행
    Axios.post("/api/product", body).then((res) => {
      if (res.data.success) {
        alert("succeeded!");
        props.history.push("/");
      } else {
        alert("failed!");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>여행 상품 업로드</Title>
      </div>
      <Form onSubmit={submitHandler}>
        {/* DropZone */}
        <FileUpload refreshFunction={updateImages}></FileUpload>
        <br />
        <br />
        <label>Title</label>
        <Input value={TitleValue} onChange={titleChangeHandler} />
        <br />
        <br />
        <label>Description</label>
        <TextArea value={Description} onChange={descriptionChangeHandler} />
        <br />
        <br />
        <label>Price($)</label>
        <Input type="number" value={Price} onChange={priceChangeHandler} />
        <br />
        <br />
        <select onChange={continentChangeHandler} value={Continent}>
          {Continents.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button onClick={submitHandler}>Submit</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
