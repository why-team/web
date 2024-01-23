function sendData(){
    const query = document.getElementById('query').value;

    const dataToSend = {query};

    fetch('url',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerText = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}