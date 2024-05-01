import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const MultiSelect = () => {
  const handleChange = (selectedValues) => {
    console.log('Selected values:', selectedValues);
  };

  return (
    <Select
      mode="multiple"
      placeholder="Select options"
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      <Option value="Option 1">Option 1</Option>
      <Option value="Option 2">Option 2</Option>
      <Option value="Option 3">Option 3</Option>
    </Select>
  );
};

export default MultiSelect;