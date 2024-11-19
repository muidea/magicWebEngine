const removeSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      title: '编号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-read-pretty': true,
    },
    name: {
      type: 'string',
      title: '名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-read-pretty': true,
      'x-component-props': {
        placeholder: "请输入仓库名称",
      }
    },
    description: {
      type: 'string',
      title: '描述',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-read-pretty': true,
      'x-component-props': {
        placeholder: "请输入仓库描述信息",
      }
    },
  },
};

const removeTitle = 'remove Warehouse';

export { removeSchema, removeTitle}