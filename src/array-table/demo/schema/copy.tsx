const copySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: "请输入仓库名称",
      }
    },
    description: {
      type: 'string',
      title: '描述',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: "请输入仓库描述信息",
      }
    },
  },
};

const copyTitle = 'copy Warehouse';

export { copySchema, copyTitle}