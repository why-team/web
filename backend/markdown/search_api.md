# 搜索API（/api/search）

### 返回格式（json）

```json
{
    "count": 3,                 // 文章数量
    "articles": [               // 每篇文章的信息，这部分和之前一样，没有改动
        {
            "id": 1145,                              // 文章编号
            "title": "Article Title",                // 标题
            "authors": "Donald Trump, Joe Biden",    // 逗号分隔的作者列表
            "abstract": "This is an abstract.",      // 摘要，长文本类型
            "doi": "10.1016/j.autcon.2012.07.001",   // doi编号
            "published_date": "Jan",
            "published_year": 2013,
            "references": [                          // 参考文献列表（deprecated）
                "HAU TD, 1990, J TRANSP ECON POLICY, V24, P203",
                "YE YC, 2001, APPL PRACTICE NEURAL"
            ],
            "url": "https://doi.org/10.1016/j.autcon.2012.07.001",
            "scores": [0.14, 0.80, 0.06]             // 文章属于每个分类的概率
        },
        {
            // ...
        }
    ],
    "graph": {                          // 图表相关信息
        "node_count": 3,                // 点的个数
        "vertex_count": 1,              // 边的个数
        "nodes": [                      // 图的节点信息（文章）
            {   
                "article_id": 1,        // 文章编号，保证编号一定在"articles"中
                "x": 0.3,               // 保证横纵坐标都在[-1,1]之间
                "y": -0.6,  
                "type": 0               // 文章所属分类，决定点的颜色，保证取值在[0,9]之间
            },
            {
                "article_id": 135,
                "x": 0.89,
                "y": 0.27,
                "type": 8
            },
            {
                "article_id": 1145,
                "x": 0.32,
                "y": 0,
                "type": 6
            }
        ],
        "vertices": [                   // 图的边信息（文章之间的相关性）
            {   
                "node1": 1,             // 边连接的第一篇文章
                "node2": 135,           // 边连接的第二篇文章
                "weight": 0.95          // 边权，保证取在[0,1]之间，表示两篇文章之间的相关性，值越大表示相关性越高
            }
        ]
    }
}
```