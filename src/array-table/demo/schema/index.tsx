import {Tag} from 'antd';
import React from 'react';

import { removeSchema, removeTitle } from "./remove"
import { copySchema, copyTitle } from "./copy"
import { updateSchema, updateTitle } from "./update"
import { createSchema, createTitle } from "./create"

declare type actionFunc = (value:any) => void
const tagRender = (val:any) =>{
  return  <Tag>{val.name}</Tag>
}

const getSchema = ( loading: boolean,createFunc: actionFunc, removeFunc: actionFunc, updateFunc:actionFunc ) => {
  return {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
        'x-component-props': {
          loading: loading,
          pagination: { pageSize: 20 },
          scroll: { x: '100%' },
        },
        items: {
          type: 'object',
          properties: {
            column_1: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                width: 50,
                title: '序号',
                align: 'center',
              },
              properties: {
                index: {
                  type: 'void',
                  'x-component': 'ArrayTable.Index',
                },
              },
            },
            column_2: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '编号',
              },
              properties: {
                code: {
                  type: 'string',
                  default: '',
                  'x-read-pretty': true,
                  'x-component': 'PreviewText',
                },
              },
            },
            column_3: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '名称',
              },
              properties: {
                name: {
                  type: 'string',
                  'x-read-pretty': true,
                  'x-component': 'PreviewText',
                },
              },
            },
            column_4: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '描述',
              },
              properties: {
                description: {
                  type: 'string',
                  'x-read-pretty': true,
                  'x-component': 'PreviewText',
                },
              },
            },
            column_5: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '地址',
              },
              properties: {
                addr: {
                  type: 'object',
                  'x-read-pretty': true,
                  'x-component': 'PreviewText.ObjectSelect',
                },
              },
            },
            column_6: {
              type: 'void',
              'x-component': 'ArrayTable.Column',
              'x-component-props': {
                title: '操作',
                dataIndex: 'operations',
                width: 100,
                fixed: 'right',
              },
              properties: {
                item: {
                  type: 'void',
                  'x-component': 'FormItem',
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayTable.Remove',
                      'x-component-props': {
                        title: removeTitle,
                        schema: removeSchema,
                        onSubmit: removeFunc,
                      }
                    },
                    copy: {
                      type: 'void',
                      'x-component': 'ArrayTable.Copy',
                      'x-component-props': {
                        title: copyTitle,
                        schema: copySchema,
                        onSubmit: createFunc,
                      }
                    },
                    update: {
                      type: 'void',
                      'x-component': 'ArrayTable.Edit',
                      'x-component-props': {
                        title: updateTitle,
                        schema: updateSchema,
                        onSubmit: updateFunc,
                      }
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
            'x-component': 'ArrayTable.Addition',
            'x-component-props': {
              title: createTitle,
              schema: createSchema,
              onSubmit: createFunc,
            }
          },
        },
      },
    },
  }
}

export default getSchema
