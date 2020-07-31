import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

function SearchFeature(props) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchHandler = (e) => {
    setSearchTerm(e.target.value);
    props.refreshFunction(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "1rem auto",
      }}
    >
      <Search
        placeholder="input search text"
        onChange={searchHandler}
        style={{ width: 200 }}
        value={searchTerm}
      />
    </div>
  );
}

export default SearchFeature;
