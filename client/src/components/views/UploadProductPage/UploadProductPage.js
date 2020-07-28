import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

function UploadProductPage() {
  const [TitleValue, setTitleValue] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);
  const [Images, setImages] = useState([]);

  const titleChangeHandler = (e) => {
    setTitleValue(e.currentTarget.value);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>여행 상품 업로드</Title>
      </div>
      <Form>
        {/* DropZone */}

        <br />
        <br />
        <label>Title</label>
        <Input value={TitleValue} onChange={titleChangeHandler} />
        <br />
        <br />
        <label>Description</label>
        <TextArea />
        <br />
        <br />
        <label>Price($)</label>
        <Input type="number" />
        <br />
        <br />
        <select>
          <option></option>
        </select>
        <br />
        <br />
        <Button>Submit</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
