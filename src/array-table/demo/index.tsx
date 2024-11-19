import React from "react"
import { PageContainer } from "@ant-design/pro-components"
import { FormItem } from "../../form-item"
import { Form } from "../../form"
import { PreviewText } from "../../preview-text"
import  { ArrayTable } from "../index"
import { createForm } from "@muidea/formily-core"
import { createSchemaField } from "@muidea/formily-react"
import getSchema from "./schema"

export default () => {
  const onCreateWarehouse = (value: any) => {
  }

  const onUpdateWarehouse = (value: any) => {
  }

  const onRemoveWarehouse = (value: any) =>{
  }

  const getInitialValues = () => {
    return {
      projects: [],
    }
  }

  const schema = getSchema(false, onCreateWarehouse, onRemoveWarehouse, onUpdateWarehouse)
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      PreviewText,
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
