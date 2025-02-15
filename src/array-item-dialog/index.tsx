import { createSchemaField } from '@muidea/formily-react'
import { Button } from 'antd'
import React from 'react'
import { FormDialog } from '../form-dialog'
import { FormItem } from '../form-item'
import { FormLayout } from '../form-layout'
import { Input } from '../input'
import { NumberPicker } from '../number-picker'
import { Password } from '../password'
import { Radio } from '../radio'
import { ObjectSelect, Select } from '../select'
import { Switch } from '../switch'
import { TimePicker } from '../time-picker'
import { Transfer } from '../transfer'
import { ObjectTreeSelect, TreeSelect } from '../tree-select'
import { Upload } from '../upload'

interface DialogProps {
  title: string
  className: string
  icon?: any
  type: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text'
  block?: boolean
  disabled?: boolean
  schema: any
  initialValues?: any
  onSubmit?: (value: any) => void
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Password,
    NumberPicker,
    Radio,
    Select,
    ObjectSelect,
    Switch,
    TimePicker,
    Transfer,
    TreeSelect,
    ObjectTreeSelect,
    Upload,
  },
})

const EditDialog = (props: DialogProps) => {
  return (
    <FormDialog.Portal>
      <Button
        title={props.title}
        className={props.className}
        icon={props.icon}
        type={props.type}
        block={props.block}
        disabled={props.disabled}
        onClick={() => {
          const dialog = FormDialog(props.title, () => {
            return (
              <FormLayout>
                <SchemaField schema={props.schema} />
              </FormLayout>
            )
          })
          dialog
            .forOpen((payload, next) => {
              next({
                initialValues: props.initialValues,
              })
            })
            .forConfirm((payload, next) => {
              next(payload)
            })
            .forCancel((payload, next) => {
              next(payload)
            })
            .open()
            .then(props.onSubmit)
        }}
      />
    </FormDialog.Portal>
  )
}

export { EditDialog }
