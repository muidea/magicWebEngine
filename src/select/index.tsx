import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps, mapReadPretty } from '@muidea/formily-react'
import { Select as AntdSelect } from 'antd'
import React from 'react'
import { PreviewText } from '../preview-text'
import { ObjectSelect as AntdObjectSelect } from './object-select'
import type { ObjectSelectProps } from './object-select'

const mapSelectProps = mapProps(
  {
    dataSource: 'options',
    loading: true,
  },
  (props, field) => ({
    ...props,
    suffixIcon:
      field?.['loading'] || field?.['validating'] ? (
        <LoadingOutlined />
      ) : (
        props.suffixIcon
      ),
  })
)

const mapSelectReadPretty = mapReadPretty(PreviewText.Select)

const mapObjectSelectReadPretty = mapReadPretty(PreviewText.ObjectSelect)

const Select = connect(AntdSelect, mapSelectProps, mapSelectReadPretty)

const ObjectSelect = connect(
  AntdObjectSelect,
  mapSelectProps,
  mapObjectSelectReadPretty
)

export { Select, ObjectSelectProps, ObjectSelect }
