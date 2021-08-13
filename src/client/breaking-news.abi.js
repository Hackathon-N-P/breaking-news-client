export default [
  {
    constant: false,
    input: [],
    name: 'init',
    output: 'void',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'newsID',
        type: 'uint128',
      },
    ],
    name: 'likeNews',
    output: 'string',
    type: 'Action',
  },
  {
    baseclass: [],
    fields: [
      {
        name: 'UserAddress',
        type: 'string',
      },
      {
        name: 'UserCredibility',
        type: 'int16',
      },
    ],
    name: 'UserInfo',
    type: 'struct',
  },
  {
    constant: true,
    input: [],
    name: 'getUsers',
    output: 'list<UserInfo>',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'vpID',
        type: 'uint128',
      },
    ],
    name: 'clearViewpoint',
    output: 'void',
    type: 'Action',
  },
  {
    constant: true,
    input: [],
    name: 'getOwner',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'title',
        type: 'string',
      },
      {
        name: 'content',
        type: 'string',
      },
      {
        name: 'image',
        type: 'string[]',
      },
      {
        name: 'createTime',
        type: 'string',
      },
    ],
    name: 'createNews',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'ID',
        type: 'uint128',
      },
      {
        name: 'content',
        type: 'string',
      },
      {
        name: 'image',
        type: 'string[]',
      },
      {
        name: 'isSupported',
        type: 'bool',
      },
      {
        name: 'createTime',
        type: 'string',
      },
    ],
    name: 'createViewPoint',
    output: 'string',
    type: 'Action',
  },
  {
    baseclass: [],
    fields: [
      {
        name: 'point',
        type: 'bool',
      },
      {
        name: 'ViewpointID',
        type: 'uint128',
      },
      {
        name: 'NewID',
        type: 'uint128',
      },
      {
        name: 'msgauthorAddress',
        type: 'string',
      },
      {
        name: 'msgContent',
        type: 'string',
      },
      {
        name: 'msgImages',
        type: 'string[]',
      },
      {
        name: 'msgUp',
        type: 'string[]',
      },
      {
        name: 'msgDown',
        type: 'string[]',
      },
      {
        name: 'BlockNumber',
        type: 'uint64',
      },
      {
        name: 'createTime',
        type: 'string',
      },
      {
        name: 'Credibility',
        type: 'int16',
      },
    ],
    name: 'Viewpoint',
    type: 'struct',
  },
  {
    baseclass: [],
    fields: [
      {
        name: 'NewTitle',
        type: 'string',
      },
      {
        name: 'NewID',
        type: 'uint128',
      },
      {
        name: 'msgauthorAddress',
        type: 'string',
      },
      {
        name: 'msgContent',
        type: 'string',
      },
      {
        name: 'msgImages',
        type: 'string[]',
      },
      {
        name: 'msgUp',
        type: 'string[]',
      },
      {
        name: 'msgDown',
        type: 'string[]',
      },
      {
        name: 'BlockNumber',
        type: 'uint64',
      },
      {
        name: 'createTime',
        type: 'string',
      },
      {
        name: 'Viewpoints',
        type: 'Viewpoint[]',
      },
      {
        name: 'Credibility',
        type: 'int16',
      },
    ],
    name: 'News',
    type: 'struct',
  },
  {
    constant: true,
    input: [],
    name: 'getNews',
    output: 'list<News>',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'newsID',
        type: 'uint128',
      },
    ],
    name: 'cancellikeNews',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'newsID',
        type: 'uint128',
      },
    ],
    name: 'dislikeNews',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'newsID',
        type: 'uint128',
      },
    ],
    name: 'canceldislikeNews',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'vpID',
        type: 'uint128',
      },
    ],
    name: 'cancellikeViewpoint',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'vpID',
        type: 'uint128',
      },
    ],
    name: 'likeViewpoint',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'vpID',
        type: 'uint128',
      },
    ],
    name: 'dislikeViewpoint',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'vpID',
        type: 'uint128',
      },
    ],
    name: 'canceldislikeViewpoint',
    output: 'string',
    type: 'Action',
  },
  {
    constant: false,
    input: [],
    name: 'clear',
    output: 'void',
    type: 'Action',
  },
  {
    constant: false,
    input: [
      {
        name: 'newsID',
        type: 'uint128',
      },
    ],
    name: 'clearNews',
    output: 'void',
    type: 'Action',
  },
];