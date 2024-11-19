import React from 'react'
import { connect, mapReadPretty, mapProps } from '@muidea/formily-react'
import { TreeSelect as AntdTreeSelect, TreeSelectProps } from 'antd'
import { CustomerProps, PreviewText } from '../preview-text'
import { LoadingOutlined } from '@ant-design/icons'
import { isArr, isObj } from '@muidea/formily-shared'

export const TreeSelect: React.FC<
  React.PropsWithChildren<TreeSelectProps<any, any> & CustomerProps>
> = connect(
  AntdTreeSelect,
  mapProps(
    {
      dataSource: 'treeData',
    },
    (
      props: React.PropsWithChildren<TreeSelectProps<any, any> & CustomerProps>,
      field
    ) => {
      const getTreeData = () => {
        const { treeData } = props
        return isArr(treeData)
          ? treeData.map((val) => ({
              label: props.formatter ? props.formatter(val) : val,
              value: props.formatter ? props.formatter(val, false) : val,
            }))
          : [
              {
                label: props.formatter ? props.formatter(treeData) : treeData,
                value: props.formatter
                  ? props.formatter(treeData, false)
                  : treeData,
              },
            ]
      }

      const getValue = () => {
        const value = props.value
        if (!value) {
          return []
        }

        return isArr(value)
          ? value.map((val) => (isObj(val) ? props.formatter(val, false) : val))
          : [isObj(value) ? props.formatter(value, false) : value]
      }

      return {
        ...props,
        suffixIcon:
          field?.['loading'] || field?.['validating'] ? (
            <LoadingOutlined />
          ) : (
            props.suffixIcon
          ),
        treeData: getTreeData(),
        value: getValue(),
      }
    }
  ),
  mapReadPretty(PreviewText.TreeSelect)
)

export default TreeSelect
