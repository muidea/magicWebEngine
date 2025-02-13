import React, { useMemo, useCallback } from 'react';
import { TreeSelect as AntdTreeSelect, TreeSelectProps } from 'antd';

export interface ObjectTreeSelectProps<T> extends Omit<TreeSelectProps<any>, 'treeData' | 'onChange' | 'value'> {
  options: T[];
  valueProp?: keyof T;
  labelProp?: keyof T;
  objectValue?: boolean;
  value?: T | any;
  onChange?: (value: T | any, label: React.ReactNode, extra: any) => void;
}

export const ObjectTreeSelect = <T extends Record<string, any>>({
  options,
  valueProp = 'id',
  labelProp = 'name',
  objectValue = true,
  value: outerValue,
  onChange,
  ...rest
}: ObjectTreeSelectProps<T>) => {
  // 递归转换树形数据
  const treeData = useMemo(() => {
    const transform = (items: T[]): any[] => {
      return items.map(item => ({
        title: item[labelProp] as React.ReactNode,
        value: item[valueProp],  // 确保 value 唯一且为基本类型
        key: item[valueProp],    // 必须唯一
        children: item.children ? transform(item.children) : undefined, // Antd 要求 undefined 而非空数组
        original: item,
      }));
    };
    return transform(options);
  }, [options, labelProp, valueProp]);

  // 处理 value 转换逻辑
  const convertedValue = useMemo(() => {
    if (objectValue && outerValue && typeof outerValue === 'object') {
      return outerValue[valueProp]; // 从对象中提取 valueProp 对应的值
    }
    return outerValue;
  }, [outerValue, objectValue, valueProp]);

  // 递归查找节点（修复多层级查找问题）
  const findNodeInTree = useCallback((nodes: any[], targetValue: any): any => {
    for (const node of nodes) {
      if (node.value === targetValue) return node;
      if (node.children) {
        const found = findNodeInTree(node.children, targetValue);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // 处理选中事件
  const handleChange = (value: any, labelList: React.ReactNode[], extra: any) => {
    const selectedItem = findNodeInTree(treeData, value);
    if (onChange) {
      const returnValue = objectValue ? selectedItem?.original : value;
      const label = rest.multiple ? labelList : labelList[0];
      onChange(returnValue, label, extra);
    }
  };

  return (
    <AntdTreeSelect
      {...rest}
      value={convertedValue}
      onChange={handleChange}
      treeData={treeData}
    />
  );
};

export default ObjectTreeSelect;