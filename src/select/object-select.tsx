import { Select as AntdSelect, SelectProps } from 'antd'
import React, { useMemo } from 'react'

export interface ObjectSelectProps<T>
  extends Omit<SelectProps<any>, 'options' | 'onChange' | 'value'> {
  options: T[]
  valueProp?: keyof T
  labelProp?: keyof T
  objectValue?: boolean
  value?: T | any
  onChange?: (value: T | any, option: any) => void
}

function ObjectSelect<T extends Record<string, any>>({
  options,
  valueProp = 'id',
  labelProp = 'name',
  objectValue = true,
  value: outerValue,
  onChange,
  ...rest
}: ObjectSelectProps<T>) {
  const selectOptions = useMemo(() => {
    return options.map((item) => ({
      label: item[labelProp] as React.ReactNode,
      value: item[valueProp],
      original: item,
    }))
  }, [options, labelProp, valueProp])

  const convertedValue = useMemo(() => {
    if (outerValue && typeof outerValue === 'object' && objectValue) {
      return outerValue[valueProp]
    }
    return outerValue
  }, [outerValue, objectValue, valueProp])

  const handleChange = (selectedValue: any, option: any) => {
    const selectedItem = options.find(
      (item) => item[valueProp] === selectedValue
    )
    if (onChange) {
      onChange(objectValue ? selectedItem : selectedValue, option)
    }
  }

  return (
    <AntdSelect
      {...rest}
      labelInValue={objectValue}
      value={convertedValue}
      onChange={handleChange}
      options={selectOptions}
    />
  )
}

export { ObjectSelect }
