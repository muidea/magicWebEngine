const warehoseList = [
  {
    id: 1,
    name: '仓库1',
    addr: '地址1',
    description: '描述1',
  },
  {
    id: 2,
    name: '仓库2',
    addr: '地址2',
    description: '描述2',
  },
  {
    id: 3,
    name: '仓库3',
    addr: '地址3',
   description: '描述3',
  }
]

const updateSchema = {
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
    addr: {
      type: 'string',
      title: '地址',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'ObjectSelect',
      'x-component-props': {
        placeholder: "请输入仓库地址",
      },
      enum: warehoseList,
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

const updateTitle = 'Update Warehouse';

export { updateSchema, updateTitle}