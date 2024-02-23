# 用户相关API说明

## 用户注册（/api/register）

此API会尝试用请求的用户名和密码进行注册。若注册成功，则自动让被注册的用户登录并传回token；否则返回错误。

### 请求格式（POST, application/json）
```json
{
    "username": "ilovedzy",             // 请求注册的用户名
    "password": "114514"                // 请求注册的密码
}
```

### 返回格式（POST, application/json）
```json
{
    "code": 101,                        // 异常编号
    "msg": "register success",          // 异常信息
    "token": "c08d1f0549c7a6300e"       // 注册后的登录token
}
```

## 用户登录（/api/login）

此API会对请求的用户名和密码进行检验，并尝试登录。若登录成功则传回token；否则返回错误。

### 请求格式（POST, application/json）
```json
{
    "username": "ilovedzy",             // 请求登录的用户名
    "password": "114514"                // 请求登录的密码
}
```

### 返回格式（POST, application/json）
```json
{
    "code": 101,                        // 异常编号
    "msg": "login success",             // 异常信息
    "token": "c08d1f0549c7a6300e"       // 登录态token
}
```

## 检验登录状态（POST, application/json）

用户可以手动调用API检验token的登录状态

### 请求格式（POST, application/json）

```json
{
    "token": "c08d1f0549c7a6300e"
}
```

### 返回格式（application/json）

```json
{
    "code": 101,                        // 异常编号
    "msg": "valid success",             // 异常信息
    "token": "c08d1f0549c7a6300e"       // 登录态token
}
```

## 修改密码（/api/change_password）

此API对传来的用户名和密码进行检验，并尝试对密码进行修改。

### 请求格式（POST, application/json）

```json
{
    "token": "c08d1f0549c7a6300e",
    "username": "ilovedzy",
    "password": "114514",
    "new_password": "1919810"
}
```

### 返回格式（application/json）

```json
{
    "code": 101,                        // 异常编号
    "msg": "success",                   // 异常信息
    "token": "c08d1f0549c7a6300e"       // 登录态token
}
```
