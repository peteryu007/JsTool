INSERT INTO [At_PunchClockInfoMobile]
    (
    [CreateUser]
    ,[CreateDateTime]
    ,[LastUpdateUser]
    ,[LastUpdateDateTime] 
    ,[gloc]
    ,[offline]
    ,[imgpath]
    ,[thumbpath]
    ,[dataremark]
    ,[OrgID]
    ,[distance]
    ,[Deviceid]
    ,[uguid]
    ,[type]
    ,[addr] 
    ,[loc]          
    ,[offtime])
values
(
    'peter'
    , getdate()
    ,'peter'
    ,getdate() 
    ,''
    ,''
    ,''
    ,''
    ,''
    ,''
    ,0
    ,''
    ,'<%= item.u_area %>'
    ,'<%= item.c_type %>'
    ,'<%= item.c_addr %>'
    ,'<%= item.c_loc %>'
    ,'<%= ctime %>')
    go   
