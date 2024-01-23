// 导入需要的模块
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// 创建 Express 应用
const app = express();
const port = 3000;

// 使用 body-parser 中间件解析 JSON 请求体
app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
})
// 简单的端点：接收前端数据并返回处理后的数据
app.post('/api/process-data', (req, res) => {
    const requestData = req.body;

    // 在真实应用中，这里可以进行更复杂的数据处理逻辑
    const processedData = {
        message: `Hello, ${requestData.name}! Your age is ${requestData.age}.`,
        timestamp: new Date()
    };

    // 返回处理后的数据给前端
    res.json(processedData);
});

// 启动服务器监听指定端口
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
