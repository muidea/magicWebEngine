import React, { useState } from 'react';
import { Form } from 'antd';
import { TreeSelect } from '../index'
import {ObjectTreeSelect} from '../object-tree-select';
import { use } from 'dumi';

const warehouseList = [
  {
    id: 1,
    name: '仓库1',
    Addr: '地址1',
    description: '描述1',
    children: [
      {
        id: 11,
        name: '子仓库11',
        Addr: '子地址1',
        description: '子描述1',
      },
      {
        id: 12,
        name: '子仓库12',
        Addr: '子地址1',
        description: '子描述1',
        children: [
          {
            id: 121,
            name: '子仓库121',
            Addr: '子地址121',
            description: '子描述1',
          },
          {
            id: 122,
            name: '子仓库122',
            Addr: '子地址122',
            description: '子描述1',
          },
        ],
          },
    ],
  },
  {
    id: 2,
    name: '仓库2',
    Addr: '地址2',
    description: '描述2',
  },
];

const Demo = () => {
  const [currentNode, setCurrentNode] = useState<any>(warehouseList[0]);
  const handleChange = (value: any, label: React.ReactNode, extra: any) => {
    setCurrentNode(value)
    console.log('选中的仓库对象：', value);
  };

  return (
    <Form>
      <Form.Item label="选择仓库">
        <ObjectTreeSelect
          options={warehouseList}
          value={currentNode}
          onChange={handleChange}
          style={{ width: 200 }}
        />
      </Form.Item>
    </Form>
  );
};

export default Demo;
