## Vue 组件生成工具

支持vue文件的解析与生成，并可以通过Json结构的对象输出代码。

目前支持解析class,@,v-on,{{}}，
指令v-或:通过checkIsDataDirectives、checkIsMethodDirectives两个方法由使用方判定是data还是method，
对于不支持的key通过unSupportedKey方法回调给业务方。

业务方可以通过convertDataResult方法对data的值进行干预，默认会创建key:""形式的data，业务处可以将此进行替换为想要的值，而不是默认的空字符串。


如何运行:

```
    npm run test
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
