function sendData() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    // 构建要发送给后端的数据对象
    const dataToSend = { name, age };

    // 发送 POST 请求到后端
    fetch('http://localhost:3000/api/process-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            // 处理后端返回的数据
            document.getElementById('result').innerText = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}