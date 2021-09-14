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

test脚本会执行某个示例JS结构文件，并输出一个SFC文件。