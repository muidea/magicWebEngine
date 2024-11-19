import React from 'react'
import { connect, mapProps, mapReadPretty } from '@muidea/formily-react'
import { Select as AntdSelect, SelectProps, TreeSelectProps } from 'antd'
import { CustomerProps, PreviewText } from '../preview-text'
import { LoadingOutlined } from '@ant-design/icons'
import { isArr, isObj } from '@muidea/formily-shared'

export const Select: React.FC<
  React.PropsWithChildren<SelectProps<any, any> & CustomerProps>
> = connect(
  AntdSelect,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (
      props: React.PropsWithChildren<SelectProps<any, any> & CustomerProps>,
      field
    ) => {
      const getOptions = () => {
        const { options } = props
        return isArr(options)
          ? options.map((val) => ({
              label: props.formatter ? props.formatter(val) : val,
              value: props.formatter ? props.formatter(val, false) : val,
            }))
          : [
              {
                label: props.formatter ? props.formatter(options) : options,
                value: props.formatter
                  ? props.formatter(options, false)
                  : options,
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

      const getDefaultValue = () => {
        const defaultValue = props.defaultValue
        if (!defaultValue) {
          return []
        }

        return isArr(defaultValue)
          ? defaultValue.map((val) =>
              isObj(val) ? props.formatter(val, false) : val
            )
          : [
              isObj(defaultValue)
                ? props.formatter(defaultValue, false)
                : defaultValue,
            ]
      }

      return {
        ...props,
        suffixIcon:
          field?.['loading'] || field?.['validating'] ? (
            <LoadingOutlined />
          ) : (
            props.suffixIcon
          ),
        options: getOptions(),
        value: getValue(),
        defaultValue: getDefaultValue(),
      }
    }
  ),
  mapReadPretty(PreviewText.Select)
)

export default Select
