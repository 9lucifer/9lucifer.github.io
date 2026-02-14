# 权限管理鉴权模型

用户登陆之后，在访问系统某个功能模块的时候，往往需要根据内容和用户进行鉴权，比如GitHub需要判断某个用户对某个仓库是否具有查看或者写入权限。常见的鉴权模型有RBAC，ABAC以及ACL。

## RBAC

rbac全称Role-Based Access Control，基于角色的权限访问，一般有三个模型：权限，角色，用户。我们需要事先定义好权限列表，以代码管理平台为例，我们可以定义如下权限：

```text
read    读仓库   
write   写仓库
clone   克隆仓库
delete  删除仓库
set     设置仓库
```

接下来是设计角色，并为角色分配权限。

```json
{
  "writer":{
    "name":"协作者",
    "permissions":[
      "read",
      "write",
      "clone"
    ]
  },
  "admin":{
    "name":"管理者",
    "permissions":[
      "read",
      "write",
      "clone",
      "set",
      "delete"
    ]
  },
}
```

有了角色之后，就是把角色赋给用户，例子如下：

```json
[
  {
    "userId":1,
    "roles":[
      "writer",
      "admin"
    ]
  }
]
```

在使用的时候，先查出某个用户的所有角色，再根据角色查出所有的权限。


> 如何做到 **某个用户对 A 仓库 read，对 B 仓库 write** 这么细？
>
> 可以设计这样的表结构
>
> | user_id | resource_id | role  |
> | ------- | ----------- | ----- |
> | 1       | repoA       | read  |
> | 1       | repoB       | write |
> | 1       | repoC       | admin |
> 
> 这个还不是abac，因为是直接查表的，而不需要动态计算



