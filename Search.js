import React, { useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const Search = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    country: '',
    state: '',
    district: ''
  });

  const handleSearch = (values) => {
    onSearch(values);
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleSearch}
      className="search-form"
    >
      <Form.Item name="keyword">
        <Input
          placeholder="Search destinations..."
          prefix={<SearchOutlined />}
          allowClear
        />
      </Form.Item>
      
      <Form.Item name="country">
        <Select placeholder="Select Country" allowClear>
          <Option value="usa">USA</Option>
          <Option value="india">India</Option>
          <Option value="uk">UK</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="state">
        <Select placeholder="Select State" allowClear>
          <Option value="state1">State 1</Option>
          <Option value="state2">State 2</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="district">
        <Select placeholder="Select District" allowClear>
          <Option value="district1">District 1</Option>
          <Option value="district2">District 2</Option>
        </Select>
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Search;