import {
  ArrayTable,
  Editable,
  Form,
  FormButtonGroup,
  FormItem,
  Input,
  NumberPicker,
  Submit,
} from '@muidea/formily-antd';
import { createForm } from '@muidea/formily-core';
import { createSchemaField } from '@muidea/formily-react';
import React from 'react';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Editable,
    Input,
    NumberPicker,
    ArrayTable,
  },
});

const form = createForm();

const schema = {
  type: 'object',
  properties: {
    projects: {
      type: 'array',
      title: 'Projects',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      items: {
        type: 'object',
        properties: {
          column_1: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 50,
              title: 'Sort',
              align: 'center',
            },
            properties: {
              sortable: {
                type: 'void',
                'x-component': 'ArrayTable.SortHandle',
              },
            },
          },
          column_2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              width: 50,
              title: 'Index',
              align: 'center',
            },
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
              },
            },
          },
          column_3: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: 'Price',
            },
            properties: {
              price: {
                type: 'number',
                default: 0,
                'x-decorator': 'Editable',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  addonAfter: '$',
                },
              },
            },
          },
          column_4: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: 'Count',
            },
            properties: {
              count: {
                type: 'number',
                default: 0,
                'x-decorator': 'Editable',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  addonAfter: '$',
                },
              },
            },
          },
          column_5: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: 'Total',
            },
            properties: {
              total: {
                type: 'number',
                'x-read-pretty': true,
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  addonAfter: '$',
                },
                'x-reactions': {
                  dependencies: ['.price', '.count'],
                  when: '{{$deps[0] && $deps[1]}}',
                  fulfill: {
                    state: {
                      value: '{{$deps[0] * $deps[1]}}',
                    },
                  },
                },
              },
            },
          },
          column_6: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: 'Operations',
            },
            properties: {
              item: {
                type: 'void',
                'x-component': 'FormItem',
                properties: {
                  remove: {
                    type: 'void',
                    'x-component': 'ArrayTable.Remove',
                  },
                  moveDown: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveDown',
                  },
                  moveUp: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveUp',
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: 'Add',
          'x-component': 'ArrayTable.Addition',
        },
      },
    },
    total: {
      type: 'number',
      title: 'Total',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        addonAfter: '$',
      },
      'x-pattern': 'readPretty',
      'x-reactions': {
        dependencies: ['.projects'],
        when: '{{$deps.length > 0}}',
        fulfill: {
          state: {
            value:
              '{{$deps[0].reduce((total,item)=>item.total ? total+item.total : total,0)}}',
          },
        },
      },
    },
  },
};

export default () => {
  return (
      <Form form={form} layout="vertical" size="large">
        <SchemaField schema={schema} />
        <FormButtonGroup>
          <Submit onSubmit={console.log}>提交</Submit>
        </FormButtonGroup>
      </Form>
  );
};
