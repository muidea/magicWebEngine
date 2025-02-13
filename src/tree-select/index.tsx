import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps, mapReadPretty } from '@muidea/formily-react'
import { TreeSelect as AntdTreeSelect } from 'antd'
import React from 'react'
import { PreviewText } from '../preview-text'
import { ObjectTreeSelect as AntdObjectTreeSelect } from './object-tree-select'

const enhanceWithLoadingSuffixIcon = (Component: React.ComponentType<any>) => {
  return connect(
    Component,
    mapProps(
      {
        dataSource: 'treeData',
      },
      (props, field) => {
        const isLoadingOrValidating =
          field?.['loading'] || field?.['validating']
        return {
          ...props,
          suffixIcon: isLoadingOrValidating ? (
            <LoadingOutlined />
          ) : (
            props.suffixIcon
          ),
        }
      }
    ),
    mapReadPretty(PreviewText.TreeSelect)
  )
}

export const TreeSelect = enhanceWithLoadingSuffixIcon(AntdTreeSelect)
export const ObjectTreeSelect =
  enhanceWithLoadingSuffixIcon(AntdObjectTreeSelect)

export default TreeSelect
