import React, { useState } from 'react';
import { Form } from 'antd';
import {ObjectSelect} from '../object-select';
const warehouseList = [
  {
    id: 1,
    name: '仓库1',
    Addr: '地址1',
    description: '描述1',
  },
  {
    id: 2,
    name: '仓库2',
    Addr: '地址2',
    description: '描述2',
  },
];

const Demo = () => {
    const [curentWarehouse, SetCurrentWarehouse] = useState<any>(warehouseList[0]);
  const handleChange = (value: any) => {
    SetCurrentWarehouse(value)
    console.log('选中的仓库对象：', value);
  };

  return (
    <Form>
      <Form.Item label="选择仓库">
        <ObjectSelect
          options={warehouseList}
          value={curentWarehouse}
          onChange={handleChange}
          style={{ width: 200 }}
        />
      </Form.Item>
    </Form>
  );
};

export default Demo;
