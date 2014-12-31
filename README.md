# tilegrid

[![spm version](http://spmjs.io/badge/tilegrid)](http://spmjs.io/package/tilegrid)

> Combine small rects into a big rect.

![](tilegrid.gif)

## 背景

贴瓷砖，在如下尺寸的场地（表格，允许合并单元格）

```
┌─┬─┬─┬─┐
├─┼─┼─┼─┤
└─┴─┴─┴─┘
```

中，放入如下随机排列的方形与矩形，要求铺满并尽量保持原来顺序

```
■
■
■
■
■■
■■（翻转90°）
```

## 安装

```
$ spm install tilegrid --save
```

## 使用

```js
var tilegrid = require('tilegrid');
// use tilegrid
```
