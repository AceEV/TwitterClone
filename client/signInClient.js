const BASE_URL = 'http://localhost:8080/';
const SIGNIN_URL = 'http://127.0.0.1:5000/signIn';
const SIGNUP_URL = 'http://127.0.0.1:5000/signUp';
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

if (signInForm != null){
    signInForm.addEventListener('submit', (event) => {
        
        event.preventDefault();
        username = document.getElementById('username').value;
        password = document.getElementById('password').value;

        console.log(username + " " + password);
        data = {
            uname: username,
            password: password
        };
        fetch(SIGNIN_URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json())
        .then(header => {
            console.log(header);
            window.location = BASE_URL + header;
        })
    })
}

if (signUpForm != null){
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();
        username = document.getElementById('username').value;
        password = document.getElementById('password').value;
        data = {
            uname: username,
            password: password
        };
        console.log(data);
        fetch(SIGNUP_URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json())
        .then(header => {
            console.log(header);
            if (header === 'Username taken'){
                alert(header);
            }
            else{
                CURRENT_USER = username;
                window.location = BASE_URL + header;
            }
            
        })

    })
}