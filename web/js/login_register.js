function login() {
    const user = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    // const token = localStorage.getItem('token');

    let formdata_login = new FormData();
    formdata_login.append('username', user);
    formdata_login.append('password', password);

    let requestOptions = {
        method: 'POST',
        body: formdata_login,
        redirect: 'follow',
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // },
    };
    //传输给后端
    fetch("http://49.232.169.105:8090/api/login", requestOptions)
        .then(response => response.json())
        .then(data => {
            const code = data.code;
            const msg = data.msg;
            const token = data.token;
            localStorage.setItem('token', token);
            if (code === 100)
            {
                window.location.href = './index.html';
            }
            alert(msg);
        })
        .catch(error => console.log('error', error)
        );

    console.log('Login:', user, password);
}

function register() {
    let user = document.getElementById('registerUsername').value;
    let password = document.getElementById('registerPassword').value;

    let formdata_register = new FormData();
    formdata_register.append("username", user)
    formdata_register.append("password", password)
    // console.log(formdata_register);

    // for (const entry of formdata_register.entries()) {
    //     console.log(entry[0], entry[1]);
    // }

    let requestOptions = {
        method: 'POST',
        body: formdata_register,
        redirect: 'follow',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
    };


    fetch("http://49.232.169.105:8090/api/register", requestOptions)
        .then(response => response.json())
        .then(data => {
            const code = data.code;
            const msg = data.msg;
            const token = data.token;
            // console.log(code);
            localStorage.setItem('token', token);

            alert(msg);

            if (code === 101)
            {
                window.location.href = './index.html';
            }
        })
        .catch(error => console.log('error', error)
        );
}