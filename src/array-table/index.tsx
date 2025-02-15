import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  ArrayField,
  FieldDisplayTypes,
  GeneralField,
} from '@muidea/formily-core'
import { Schema } from '@muidea/formily-json-schema'
import {
  observer,
  ReactFC,
  RecursionField,
  useField,
  useFieldSchema,
} from '@muidea/formily-react'
import { clone, isArr, isBool, isUndef } from '@muidea/formily-shared'
import { Badge, Pagination, Select, Space, Table } from 'antd'
import { PaginationProps } from 'antd/lib/pagination'
import { SelectProps } from 'antd/lib/select'
import { ColumnProps, TableProps } from 'antd/lib/table'
import cls from 'classnames'
import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ArrayBase, ArrayBaseMixins, IArrayBaseProps } from '../array-base'
import { EditDialog } from '../array-item-dialog'
import {
  SortableContainer,
  SortableElement,
  usePrefixCls,
} from '../__builtins__'

interface ObservableColumnSource {
  field: GeneralField
  columnProps: ColumnProps<any>
  schema: Schema
  display: FieldDisplayTypes
  name: string
}
interface IArrayTablePaginationProps extends PaginationProps {
  dataSource?: any[]
  showPagination?: boolean
  children?: (
    dataSource: any[],
    pagination: React.ReactNode,
    options: {
      startIndex: number
    }
  ) => React.ReactElement
}

interface IStatusSelectProps extends SelectProps<any> {
  pageSize?: number
}

type ComposedArrayTable = React.FC<
  React.PropsWithChildren<TableProps<any> & IArrayBaseProps>
> &
  ArrayBaseMixins & {
    Column?: React.FC<React.PropsWithChildren<ColumnProps<any>>>
  }

interface PaginationAction {
  totalPage?: number
  pageSize?: number
  showPagination?: boolean
  changePage?: (page: number) => void
}

const SortableRow = SortableElement((props: any) => <tr {...props} />)
const SortableBody = SortableContainer((props: any) => <tbody {...props} />)

const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Column') > -1
}

const isOperationsComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Operations') > -1
}

const isAdditionComponent = (schema: Schema) => {
  return schema['x-component']?.indexOf('Addition') > -1
}

const useArrayTableSources = () => {
  const arrayField = useField()
  const schema = useFieldSchema()
  const parseSources = (schema: Schema): ObservableColumnSource[] => {
    if (
      isColumnComponent(schema) ||
      isOperationsComponent(schema) ||
      isAdditionComponent(schema)
    ) {
      if (!schema['x-component-props']?.['dataIndex'] && !schema['name'])
        return []
      const name = schema['x-component-props']?.['dataIndex'] || schema['name']
      const field = arrayField.query(arrayField.address.concat(name)).take()
      // @ts-ignore
      const columnProps =
        field?.component?.[1] || schema['x-component-props'] || {}
      const display = field?.display || schema['x-display'] || 'visible'
      return [
        {
          name,
          display,
          field,
          schema,
          columnProps,
        },
      ]
    } else if (schema.properties) {
      return schema.reduceProperties((buf, schema) => {
        // @ts-ignore
        return buf.concat(parseSources(schema))
      }, [])
    }

    return []
  }

  const parseArrayItems = (schema: Schema['items']) => {
    if (!schema) return []
    const sources: ObservableColumnSource[] = []
    const items = isArr(schema) ? schema : [schema]
    return items.reduce((columns, schema) => {
      const item = parseSources(schema)
      if (item) {
        return columns.concat(item)
      }
      return columns
    }, sources)
  }

  if (!schema) throw new Error('can not found schema object')

  return parseArrayItems(schema.items)
}

const useArrayTableColumns = (
  dataSource: any[],
  field: ArrayField,
  sources: ObservableColumnSource[]
): TableProps<any>['columns'] => {
  return sources.reduce((buf, { name, columnProps, schema, display }, key) => {
    if (display !== 'visible') return buf
    if (!isColumnComponent(schema)) return buf
    return buf.concat({
      ...columnProps,
      key,
      dataIndex: name,
      render: (value: any, record: any) => {
        const index = dataSource?.indexOf(record)
        // @ts-ignore
        const children = (
          <ArrayBase.Item index={index} record={() => field?.value?.[index]}>
            <RecursionField schema={schema} name={index} onlyRenderProperties />
          </ArrayBase.Item>
        )
        return children
      },
    })
  }, [])
}

const useAddition = () => {
  const schema = useFieldSchema()
  return schema.reduceProperties((addition, schema, key) => {
    if (isAdditionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />
    }
    return addition
  }, null)
}

const schedulerRequest = {
  request: null,
}

const StatusSelect: ReactFC<IStatusSelectProps> = observer(
  (props) => {
    const field = useField<ArrayField>()
    const prefixCls = usePrefixCls('formily-array-table')
    const errors = field.errors
    const parseIndex = (address: string) => {
      return Number(
        address
          .slice(address.indexOf(field.address.toString()) + 1)
          .match(/(\d+)/)?.[1]
      )
    }
    const options = props.options?.map(({ label, value }) => {
      const val = Number(value)
      const hasError = errors.some(({ address }) => {
        const currentIndex = parseIndex(address)
        const startIndex = (val - 1) * props.pageSize
        const endIndex = val * props.pageSize
        return currentIndex >= startIndex && currentIndex <= endIndex
      })
      return {
        label: hasError ? <Badge dot>{label}</Badge> : label,
        value,
      }
    })

    const width = String(options?.length).length * 15

    return (
      <Select
        value={props.value}
        onChange={props.onChange}
        options={options}
        virtual
        style={{
          width: width < 60 ? 60 : width,
        }}
        className={cls(`${prefixCls}-status-select`, {
          'has-error': errors?.length,
        })}
      />
    )
  },
  {
    scheduler: (update) => {
      // @ts-ignore
      clearTimeout(schedulerRequest.request)
      // @ts-ignore
      schedulerRequest.request = setTimeout(() => {
        update()
      }, 100)
    },
  }
)

const PaginationContext = createContext<PaginationAction>({})
const usePagination = () => {
  return useContext(PaginationContext)
}

const ArrayTablePagination: ReactFC<IArrayTablePaginationProps> = (props) => {
  const [current, setCurrent] = useState(1)
  const prefixCls = usePrefixCls('formily-array-table')
  const showPagination = props.showPagination ?? true
  const pageSize = props.pageSize || 10
  const size = props.size || 'default'
  const dataSource = props.dataSource || []
  const startIndex = (current - 1) * pageSize
  const endIndex = startIndex + pageSize - 1
  const total = dataSource?.length || 0
  const totalPage = Math.ceil(total / pageSize)
  const pages = Array.from(new Array(totalPage)).map((_, index) => {
    const page = index + 1
    return {
      label: page,
      value: page,
    }
  })
  const handleChange = (current: number) => {
    setCurrent(current)
  }

  useEffect(() => {
    if (totalPage > 0 && totalPage < current) {
      handleChange(totalPage)
    }
  }, [totalPage, current])

  const renderPagination = () => {
    if (totalPage <= 1 || !showPagination) return
    return (
      <div className={`${prefixCls}-pagination`}>
        <Space>
          <StatusSelect
            value={current}
            pageSize={pageSize}
            onChange={handleChange}
            options={pages}
            notFoundContent={false}
          />
          <Pagination
            {...props}
            pageSize={pageSize}
            current={current}
            total={dataSource.length}
            size={size}
            showSizeChanger={false}
            onChange={handleChange}
          />
        </Space>
      </div>
    )
  }

  return (
    <Fragment>
      <PaginationContext.Provider
        value={{
          totalPage,
          pageSize,
          changePage: handleChange,
          showPagination,
        }}
      >
        {props.children?.(
          showPagination
            ? dataSource?.slice(startIndex, endIndex + 1)
            : dataSource,
          renderPagination(),
          { startIndex }
        )}
      </PaginationContext.Provider>
    </Fragment>
  )
}

const RowComp: ReactFC<React.HTMLAttributes<HTMLTableRowElement>> = (props) => {
  const prefixCls = usePrefixCls('formily-array-table')
  const index = props['data-row-key'] || 0
  return (
    <SortableRow
      lockAxis="y"
      {...props}
      index={index}
      className={cls(props.className, `${prefixCls}-row-${index + 1}`)}
    />
  )
}

export const ArrayTable: ComposedArrayTable = observer((props) => {
  const ref = useRef<HTMLDivElement>()
  const field = useField<ArrayField>()
  const prefixCls = usePrefixCls('formily-array-table')
  const dataSource = Array.isArray(field.value) ? field.value.slice() : []
  const sources = useArrayTableSources()
  const columns = useArrayTableColumns(dataSource, field, sources)
  const pagination = isBool(props.pagination)
    ? { showPagination: props.pagination }
    : props.pagination
  const addition = useAddition()
  const { onAdd, onCopy, onEdit, onRemove, onMoveDown, onMoveUp } = props
  const defaultRowKey = (record: any) => {
    return dataSource.indexOf(record)
  }
  const addTdStyles = (id: number) => {
    const node = ref.current?.querySelector(`.${prefixCls}-row-${id}`)
    const helper = document.body.querySelector(`.${prefixCls}-sort-helper`)
    if (!helper) return
    const tds = node?.querySelectorAll('td')
    if (!tds) return
    requestAnimationFrame(() => {
      helper.querySelectorAll('td').forEach((td, index) => {
        if (tds[index]) {
          td.style.width = getComputedStyle(tds[index]).width
        }
      })
    })
  }
  const getWrapperComp = useCallback(
    (dataSource: any[], start: number) => (props: any) =>
      (
        <SortableBody
          {...props}
          start={start}
          list={dataSource.slice()}
          accessibility={{
            container: ref.current || undefined,
          }}
          onSortStart={(event) => {
            addTdStyles(event.active.id as number)
          }}
          onSortEnd={({ oldIndex, newIndex }) => {
            field.move(oldIndex, newIndex)
          }}
          className={cls(`${prefixCls}-sort-helper`, props.className)}
        />
      ),
    [field]
  )
  return (
    <ArrayTablePagination {...pagination} dataSource={dataSource}>
      {(dataSource, pager, { startIndex }) => (
        <div ref={ref} className={prefixCls}>
          <ArrayBase
            onAdd={onAdd}
            onEdit={onEdit}
            onCopy={onCopy}
            onRemove={onRemove}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          >
            <Table
              size="small"
              bordered
              rowKey={defaultRowKey}
              {...props}
              onChange={() => {}}
              pagination={false}
              columns={columns}
              dataSource={dataSource}
              components={{
                body: {
                  wrapper: getWrapperComp(dataSource, startIndex),
                  row: RowComp,
                },
              }}
            />
            <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div>
            {sources.map((column, key) => {
              //专门用来承接对Column的状态管理
              if (!isColumnComponent(column.schema)) return
              return React.createElement(RecursionField, {
                name: column.name,
                schema: column.schema,
                onlyRenderSelf: true,
                key,
              })
            })}
            {addition}
          </ArrayBase>
        </div>
      )}
    </ArrayTablePagination>
  )
})

ArrayTable.displayName = 'ArrayTable'

ArrayTable.Column = () => {
  return <Fragment />
}

ArrayBase.mixin(ArrayTable)

const Addition: ArrayBaseMixins['Addition'] = (props) => {
  const self = useField()
  const array = ArrayBase.useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  if (!array) return null
  if (array.field?.pattern !== 'editable') return null
  return (
    <EditDialog
      title={props.title || self.title}
      className={cls(`${prefixCls}-addition`, props.className)}
      icon={isUndef(props.icon) ? <PlusOutlined /> : props.icon}
      type="dashed"
      block
      schema={props.schema}
      onSubmit={props.onSubmit}
    />
  )
}
ArrayTable.Addition = Addition

const Copy: ArrayBaseMixins['Copy'] = (props) => {
  const index = ArrayBase.useIndex(props.index)
  const self = useField()
  const array = ArrayBase.useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  if (!array) return null
  if (array.field?.pattern !== 'editable') return null

  const value = clone(array?.field?.value[index])
  return (
    <EditDialog
      title={props.title || self.title}
      className={cls(`${prefixCls}-copy`, props.className)}
      icon={isUndef(props.icon) ? <CopyOutlined /> : props.icon}
      type="text"
      schema={props.schema}
      initialValues={value}
      onSubmit={props.onSubmit}
    />
  )
}
ArrayTable.Copy = Copy

const Remove: ArrayBaseMixins['Remove'] = (props: any) => {
  const index = ArrayBase.useIndex(props.index)
  const self = useField()
  const array = ArrayBase.useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  if (!array) return null

  const value = clone(array?.field?.value[index])
  return (
    <EditDialog
      title={props.title || self.title}
      className={cls(`${prefixCls}-remove`, props.className)}
      icon={isUndef(props.icon) ? <DeleteOutlined /> : props.icon}
      type="text"
      schema={props.schema}
      initialValues={value}
      onSubmit={props.onSubmit}
    />
  )
}
ArrayTable.Remove = Remove

const Edit: ArrayBaseMixins['Edit'] = (props: any) => {
  const index = ArrayBase.useIndex(props.index)
  const self = useField()
  const array = ArrayBase.useArray()
  const prefixCls = usePrefixCls('formily-array-base')
  if (!array) return null
  if (array.field?.pattern !== 'editable') return null

  const value = clone(array?.field?.value[index])
  return (
    <EditDialog
      title={props.title || self.title}
      className={cls(`${prefixCls}-edit`, props.className)}
      icon={isUndef(props.icon) ? <EditOutlined /> : props.icon}
      type="text"
      schema={props.schema}
      initialValues={value}
      onSubmit={props.onSubmit}
    />
  )
}
ArrayTable.Edit = Edit

export default ArrayTable
