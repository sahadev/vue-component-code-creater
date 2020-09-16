## Vue 组件生成工具

如何运行:

```
    npm run test.js
```

2020 年 09 月 16 日 11:33:10

目前所用的 XML 解析器解析的结果如下：

```json
{
  "template": {
    "div": {
      "div": {
        "undefined": "This is a draggable view! Please drag me!",
        "id": "bHLJCzFC"
      },
      "input": {
        "type": "text",
        "value": "input something T1",
        "id": "6zB8yxfH"
      },
      "el-button": {
        "undefined": "主要按钮T1",
        "type": "primary",
        "id": "BiU1HISg"
      },
      "el-radio-group": {
        "v-model": "radio",
        "id": "stalEH2J",
        "el-radio": [
          {
            "undefined": "备选项 T1",
            ":label": 3,
            "id": "EaP7CtUh"
          },
          {
            "undefined": "备选项 T1",
            ":label": 6,
            "id": "GohcwnEA"
          }
        ]
      }
    }
  }
}
```

我们需要实现这样的:

```json
{
  "template": {
    "div": {
      "div": {
        "undefined": "This is a draggable view! Please drag me!",
        "id": "bHLJCzFC"
      },
      "input": {
        "type": "text",
        "value": "input something T1",
        "id": "6zB8yxfH"
      },
      "el-button": {
        "undefined": "主要按钮T1",
        "type": "primary",
        "id": "BiU1HISg"
      },
      "el-radio-group": {
        "v-model": "radio",
        "id": "stalEH2J",
        "__children": [
          {
            "el-radio": {
              "undefined": "备选项 T1",
              ":label": 3,
              "id": "EaP7CtUh"
            }
          },
          {
            "el-radio": {
              "undefined": "备选项 T1",
              ":label": 6,
              "id": "GohcwnEA"
            }
          }
        ]
      }
    }
  }
}
```
