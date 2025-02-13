import { LoadingOutlined } from '@ant-design/icons';
import {
  connect,
  mapProps,
  mapReadPretty,
} from '@muidea/formily-react';
import { Select as AntdSelect } from 'antd';
import React from 'react';
import { PreviewText } from '../preview-text';
import { ObjectSelect as AntdObjectSelect } from './object-select';

const enhanceWithLoadingSuffixIcon = (Component: React.ComponentType<any>) => {
  return connect(
    Component,
    mapProps(
      {
        dataSource: 'options',
      },
      (props, field) => ({
        ...props,        
        fieldNames: { label: props.labelProp, value: props.valueProp },
        suffixIcon: field?.['loading'] || field?.['validating'] ? (
          <LoadingOutlined />
        ) : (
          props.suffixIcon
        ),
      })
    ),
    mapReadPretty(PreviewText.Select)
  );
};

export const Select = enhanceWithLoadingSuffixIcon(AntdSelect);
export const ObjectSelect = enhanceWithLoadingSuffixIcon(AntdObjectSelect);
export default Select;