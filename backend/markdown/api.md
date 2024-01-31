# 接口格式

## /api/search （搜索文章）
### 请求格式（POST, json）
{
    'title': 'Title of Paper',
    'authors': [        //  作者列表，可以置空
        'Author 1',
        'Author 2'
    ],
    'published_year': [ // 文章发表年份的上下界
        2010,           // 如果不指定上界，此处置为-1
        2015            // 如果不指定上界，此处置为-1
    ],
    'abstract': 'Keywords for searching'
}

### 返回格式 (json)
{
    'count': 20,
    'articles': [
        {
            'abstract': 'Abstract of article',
            'authors': [
                'Author 1',
                'Author 2'
            ],
            'doi': '10.1016/j.autcon.2023.105242',
            'id': 15,                   // 文章id
            'published_date': 'Feb',    // 文章发表的日期（不包含年份）
            'published_year': 2023,
            'references': [
                'Reference 1',
                'Reference 2'
            ],
            'title': 'Title of paper',
            'url': 'https://doi.org/10.1016/j.autcon.2023.105242'
        }
    ]
}


## /api/favorite/add （添加收藏夹）
### 请求格式（POST; json）
{
    'article_id': 123
}

### 返回格式（json）
{
    'errno': 100,
    'message': 'success'
}


## /api/favorite/remove（删除收藏夹）
### 请求格式（POST; json）
{
    'article_id': 123
}

### 返回格式（json）
{
    'errno': 100,
    'message': 'success'
}
