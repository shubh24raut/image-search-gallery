import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import React, { useState } from "react";
import "../../less/App.less";
import Input from "antd/es/input/Input";

let searchDebounce = null;

function SearchComponent(props) {
  const [query, setQuery] = useState("");
  const { debounceTime, name = "", getData, ...rest } = props;

  const handleChange = ({ target: { value } }) => {
    setQuery(value);
    if (getData) {
      if (searchDebounce) {
        searchDebounce?.cancel();
        searchDebounce = null;
      }
      searchDebounce = debounce(getData, debounceTime || 1000);
      searchDebounce(value);
    }
  };

  return (
    <Input
      size="small"
      className="search-debounce-input"
      placeholder={`Search ${name}`}
      value={query}
      name={name}
      allowClear
      onChange={handleChange}
      prefix={<SearchOutlined />}
      {...rest}
    />
  );
}

export default SearchComponent;
