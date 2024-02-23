# 收藏夹API介绍

## /api/favorite/add （添加收藏夹）

将单篇文章添加至token对应用户的收藏夹中。

### 请求格式（POST; application/json）
```json
{
    "article_id": 123,
    "token": "0123456789abcdefg"
}
```

### 返回格式（json）
```json
{
    "errno": 101,
    "message": "success"
}
```


## /api/favorite/remove（移出收藏夹）

将单篇文章从token对应用户的收藏夹中移除。

### 请求格式（POST; application/json）
```json
{
    "article_id": 123,
    "token": "0123456789abcdefg"
}
```

### 返回格式（json）
```json
{
    "errno": 101,
    "message": "success"
}
```