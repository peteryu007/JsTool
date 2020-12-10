# Json 文件转 sql

## 用途

ejim这里考勤打卡，导出数据是json格式，需要转下成sql格式，插入At_PunchClockInfoMobile表。
sql server自己分析长json 太慢了。


## 补充

At_PunchClockInfoMobile 可以重复插入，因为导入At_PunchClockInfo表，sql去重了。