# csproj2bat

把vs的csproj 改成 bat文件用单csc.exe 编译
可以在只有.net framework而没有sdk的环境编译，用于一些小cs工程去生产环境编译。
似乎只适合.net 4.0,(.net 4.5以后待确认)

## 软件架构

node

## 依赖

1. xmldom
2. xpath

## 使用说明

使用npm注册全局了

```bat
rem npm install -g
```

例如

```bat
cs2bat -f "D:\Project_All\Gits\v10_Branch\V10.4.2\WebService\Web\Penseesoft.WebService.Web.csproj" -b d:\bin\

dir2bat -f "D:\Project_All\Gits\Patch\Penseesoft.Attendance.TestApi.Web\Penseesoft.Attendance.TestApi.Web.bat"  -c "D:\Project_All\Gits\Patch\Penseesoft.Attendance.TestApi.Web\src"  -b "D:\Project_All\Gits\v10_Branch\V10.4.2\web\bin" 
```

## Update Log

2020-12-9 v0.1.1

* 添加 yargs库使得命令行更加方便
* 添加package.json launch.json
* npm install -g 注册全局