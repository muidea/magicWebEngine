import React from "react"
import { FormItem } from "../../form-item"
import { Form } from "../../form"
import { PreviewText } from "../../preview-text"
import { Select, ObjectSelect } from "../../select"
import  { ArrayTable } from "../index"
import { createForm } from "@muidea/formily-core"
import { createSchemaField } from "@muidea/formily-react"
import getSchema from "./schema"

export default () => {
  const onCreateWarehouse = (value: any) => {
    console.log(value)
  }

  const onUpdateWarehouse = (value: any) => {
    console.log(value)
  }

  const onRemoveWarehouse = (value: any) =>{
    console.log(value)
  }

  const getInitialValues = () => {
    return {
      items: [{
        code: '1001',
        name: 'test Name',
        description: 'test description',
        addr: {
          id: 3,
          name: '仓库3',
          addr: '地址3',
         description: '描述3',
        },
      }],
    }
  }

  const schema = getSchema(false, onCreateWarehouse, onRemoveWarehouse, onUpdateWarehouse)
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      PreviewText,
      Select,
      ObjectSelect,
      ArrayTable,
    },
  })

  return (
      <Form
        form={createForm({ initialValues: getInitialValues() })}
        layout="vertical"
      >
        <SchemaField schema={schema} />
      </Form>
  )
}
