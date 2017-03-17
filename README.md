## vscode 插件 
------------------
在书写css 时 一键式 输入当前目录下的 图片的 尺寸 及 url
![Alt text](./GIF.jpg "动画")

f1 ---> call img --> 选择图片 

生成以下代码
```
    width: 1920px;
    height: 800px;
    background-image:url(../img/common/header-bg.jpg);
```
快捷键
```
{
        "key": "ctrl+shift+4",
        "command": "linz.callImg"
    }
```

仅查找 工作目录下  src 、 publuc 、assets 下所有图片
目前没有写配置 需要的 可以自己到 src/util.ts 下修改
